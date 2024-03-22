const auctionScraper = require('./src/scrapers/auctionScraper');


async function run() {
  try {
    // Uncomment the following line if you want to delete all documents in the collection before scraping
    // await auctionScraper.deleteAllDocumentsInCollection();
    


    await auctionScraper.scrapeWebpage('https://auctions.vfauctions.co.uk/auctions');
  } catch (error) {
    console.error('Error:', error);
  }
}

run();
