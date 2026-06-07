'use strict';

const fastifyPlugin = require('fastify-plugin');
const fastifyMongoPlugin = require('@fastify/mongodb');

//const connectionString = `mongodb://${username}:${password}@${hostname}/${dbName}`
// These values are populated from the .env file
const username = process.env.mongo_username;
const password = process.env.mongo_password;
const dbName   = process.env.mongo_dbname;
const hostname = process.env.COOLSTORE_DB_SERVICE_HOST || process.env.mongo_hostname || 'localhost';

const connectionString = `mongodb://${username}:${password}@${hostname}/${dbName}`;

async function dbConnector (fastify, options) {
  fastify.register(fastifyMongoPlugin, {
    url: connectionString
  });
}

module.exports = fastifyPlugin(dbConnector, {
  name: 'mongo-connector'
});
