const argv = require('minimist')(process.argv.slice(2));
const makeLogger = require('denizen-lib-server/lib/utils/logger');
const pino = require('pino');
const config = require('./config');
const logger = makeLogger(pino({
  extreme: false,
  name: 'OVER_PRO',
  level: 'debug',
}));
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;


// Sets the environment to fetch the data from and to
const origin = (argv.o) ? argv.o : 'dev';
const destination = (argv.d) ? argv.d : 'local';
const collectionToCopy = (argv.c) ? argv.c : 'rates';

async function main() {
  try {
    logger.accessing(`Connecting to ${origin} database ...`);
    const clientOrigin = await MongoClient.connect(config[origin].url, {});
    logger.accessing(`Connecting to ${destination} database ...`);
    const clientDestination = await MongoClient.connect(config[destination].url, {});
    const collectionOrigin = clientOrigin.db('hermesms').collection(collectionToCopy);
    const collectionDestination = clientDestination.db('hermesms').collection(collectionToCopy);
    logger.accessing(`Removing collection in ${destination}...`);
    await collectionDestination.deleteMany({});
    logger.accessing(`Getting collection from ${origin} ...`);
    const collection = await collectionOrigin.find({}).toArray();
    logger.accessing(`Inserting collection in  ${destination}...`);
    await collectionDestination.insertMany(collection);
    clientOrigin.close();
    clientDestination.close();
    logger.end();
  }
  catch (err) {
    logger.error({err}, 'Something went wrong ...');
  }
}

main();
