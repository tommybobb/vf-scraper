const { MongoClient, ServerApiVersion } = require('mongodb');
const env = require('dotenv').config();

const dbConfig = process.env.MONGO_CONN_STRING;


const uri = dbConfig;
const dbName = "vf-auctions";
const collectionName = "vf-auctions";

class MongoDB {
  constructor() {
    this.client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      }
    });
  }

  async connect() {
    await this.client.connect();
  }

  async disconnect() {
    await this.client.close();
  }

  getDb() {
    return this.client.db(dbName);
  }

  getCollection() {
    return this.client.db(dbName).collection(collectionName);
  }
}

module.exports = new MongoDB();
