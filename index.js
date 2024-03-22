const auctionScraper = require('./src/scrapers/auctionScraper');
const { formatTime } = require('./src/utils/helpers');



async function run() {
  try {
    // Uncomment the following line if you want to delete all documents in the collection before scraping
    // await auctionScraper.deleteAllDocumentsInCollection();
    
    console.log(`Starting process at ${formatTime(new Date)}`)

    await auctionScraper.scrapeWebpage('https://auctions.vfauctions.co.uk/auctions');

    console.log(`Finishing process at ${formatTime(new Date)}`)

  } catch (error) {
    console.error('Error:', error);
  }
}



setInterval(run, 60000);
run();