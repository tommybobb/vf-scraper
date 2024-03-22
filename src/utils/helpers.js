const MongoDB = require('../db/mongodb');

async function insertDocument(recordFields) {
  const collection = MongoDB.getCollection();
  const result = await collection.insertOne(recordFields);
  return result.insertedId;
}

async function updateDocumentInMongoDB(recordId, updateFields) {
  const collection = MongoDB.getCollection();
  const filter = { _id: recordId };
  const updateDocument = { $set: updateFields };
  const result = await collection.updateOne(filter, updateDocument);
  return 1;
}

async function checkGUIDExists(guid) {
  const collection = MongoDB.getCollection();
  const result = await collection.findOne({ guid });
  return result ? result._id : null;
}

module.exports = { insertDocument, updateDocumentInMongoDB, checkGUIDExists };