const argv = require('minimist')(process.argv.slice(2));
const config = require('./config');
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;


// Sets the environment to fetch the data from and to
const origin = (argv.o) ? argv.o : 'dev';
const destination = (argv.d) ? argv.d : 'local';
const collectionToCopy = (argv.c) ? argv.c : 'rates';

async function main() {
  try {
    console.log(`Connecting to ${origin} database ...`);
    const clientOrigin = await MongoClient.connect(config[origin].url, {});
    console.log(`Connecting to ${destination} database ...`);
    const clientDestination = await MongoClient.connect(config[destination].url, {});
    const collectionOrigin = clientOrigin.db('hermesms').collection(collectionToCopy);
    const collectionDestination = clientDestination.db('hermesms').collection(collectionToCopy);
    console.log(`Removing collection in ${destination}...`);
    await collectionDestination.deleteMany({});
    console.log(`Getting collection from ${origin} ...`);
    const collection = await collectionOrigin.find({}).toArray();
    console.log(`Inserting collection in  ${destination}...`);
    await collectionDestination.insertMany(collection);
    clientOrigin.close();
    clientDestination.close();
  }
  catch (err) {
    console.log({err}, 'Something went wrong ...');
  }
}

main();
