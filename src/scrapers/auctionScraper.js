const axios = require('axios');
const cheerio = require('cheerio');
const MongoDB = require('../db/mongodb');
const { insertDocument, updateDocumentInMongoDB, checkGUIDExists, getActiveDocuments } = require('../utils/helpers');

class AuctionScraper {
  constructor() {
    this.db = MongoDB;
  }

  async scrapeWebpage(url) {
    try {
      await this.db.connect();
      const response = await axios.get(url);
      const $ = cheerio.load(response.data);
      const linkClass = '.item.flex-1.mobile.hidden';
      const linksWithSpecificClass = $(linkClass).find('a');
      let auctionIds = [];

      await Promise.all(linksWithSpecificClass.map(async (index, element) => {
        const linkText = $(element).text();
        const linkLink = $(element).attr('href');
        const auctionTop = $(element).closest('div.content.overflow-wrap');
        const auctionItem = auctionTop.closest('div.auction-list-item');
        const auctionId = auctionItem.attr('data-auction-id');
        const parentElement = auctionTop.find('span.sale-date');
        const startDate = parentElement.eq(0).text().trim();
        const endDate = parentElement.eq(1).text().trim();

        const guidExists = await checkGUIDExists(auctionId);

        
        const recordFields = {
          guid: auctionId,
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          isActive: linkText === 'View catalogue',
          LastUpdated: new Date(),
          actualEndDate: "",
          url: linkLink
        };

        let doc;
        if (guidExists == null) {
          doc = await insertDocument(recordFields);
        } else {
          doc = await updateDocumentInMongoDB(guidExists, recordFields);
        }

        if(linkText === 'View catalogue'){
          auctionIds.push(auctionId);
        }

        // const status = recordFields.startDate < new Date() && !recordFields.isActive ? 'Late' : 'On Time';
        // const logString = `Index ${index}: Action ID - ${recordFields.guid} | Active: ${recordFields.isActive} | Status: ${status}`;
        // console.log(logString);
        // console.log('-----------');
      }));

      const activeDocs = await getActiveDocuments();

      await Promise.all(activeDocs.map(async (item, index) => {
        
        if(!auctionIds.includes(item.guid)){
          item.actualEndDate = new Date();
          item.isActive = false;
          const doc = await updateDocumentInMongoDB(item._id, item);
        } else {
          if(item.actualStartDate == ''){
            item.actualStartDate = new Date();
            const doc = await updateDocumentInMongoDB(item._id, item);
          }

        }

        

      }));

      await this.db.disconnect();
    } catch (error) {
      console.error('Error:', error);
    }
  }
}

module.exports = new AuctionScraper();
