'use strict'

const fastifyAutoload = require("@fastify/autoload");

module.exports = async function (fastify, opts) {
  const collection = fastify.mongo.db.collection('orders');

  fastify.get('/api/orders', async function (request, reply) {
    // Return a list of all the orders
    const orders = await collection.find().toArray();
    return orders;
  });

  fastify.post('/api/orders', async function (request, reply) {
    //Add the order to the DB then Send back the full list of Orders.
    reply.code (400);
    return 'NOT IMPLEMENTED';
  });

  fastify.get('/api/orders/:orderId/:status', async function (request, reply) {
    const { orderId, status } = request.params;
    console.log(orderId, status);
    reply.code (400);
    return 'NOT IMPLEMENTED';
  });
}
