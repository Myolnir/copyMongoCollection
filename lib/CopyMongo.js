const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

module.exports = class CopyMongo {

  async copyCollection ({originDatabaseName, originUrl}, {destinationDatabaseName, destinationUrl}, collectionToCopy) {
    let clientOrigin;
    let clientDestination;
    try {
      console.log(`Connecting to ${origin} database ...`);
      clientOrigin = await MongoClient.connect(config[origin].url, {});
      console.log(`Connecting to ${destination} database ...`);
      clientDestination = await MongoClient.connect(config[destination].url, {});
      const collectionOrigin = clientOrigin.db('hermesms').collection(collectionToCopy);
      const collectionDestination = clientDestination.db('hermesms').collection(collectionToCopy);
      console.log(`Removing collection in ${destination}...`);
      await collectionDestination.deleteMany({});
      console.log(`Getting collection from ${origin} ...`);
      const collection = await collectionOrigin.find({}).toArray();
      console.log(`Inserting collection in  ${destination}...`);
      await collectionDestination.insertMany(collection);
    } catch (err) {
      console.log(err);
    } finally {
      if (clientOrigin) {
        clientOrigin.close();
      }
      if (clientDestination) {
        clientDestination.close();
      }
    }
  }
};