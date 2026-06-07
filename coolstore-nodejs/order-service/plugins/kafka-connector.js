'use strict';

const fastifyPlugin = require('fastify-plugin');
const { Kafka, logLevel } = require('kafkajs');

const groupId = 'consumer-orders';
const topics = ['orders', 'payments']

const host = process.env.MY_CLUSTER_KAFKA_BOOTSTRAP_SERVICE_HOST || process.env['kafka_host'] || 'localhost';
const port = process.env.KAFKA_SERVICE_PORT || process.env['kafka_port'] || 9092;

// Create the Kafka Instance and such
const kafkaConnectionBinding = {
  brokers: [`${host}:${port}`],
  clientId: 'order-service-consumer'
};

async function processOrder(collection, message) {
  let newOrder;
  // Insert this order into the orders collection
  try {
    newOrder = JSON.parse(message.value.toString());

    // apparently the credit card number and expiration fields need to be different to display on the order page on the front-end :shrugs:
    newOrder.ccNumber = newOrder.creditCard.number;
    newOrder.ccExp = newOrder.creditCard.expiration;
    delete newOrder.creditCard;

    // Add the PROCESSING status
    newOrder.status = 'PROCESSING';

    // Also look up the orderID first since we might get a bunch of orders coming in when we first bring this up
    const orderInDB = await collection.findOne({orderId: newOrder.orderId});
    if (!orderInDB) {
      const result = await collection.insertOne(newOrder);
      console.log('Order Inserted', result);
    } else {
      console.log('Order Already Added', orderInDB);
    }
  }
   catch (err) {
    console.log(err);
  }
}

async function processPayment(collection, message) {
  let payment;
  try {
    payment = JSON.parse(message.value.toString());

    const filter = { orderId: payment.orderId };
    const updateDoc = {
      $set: {
        status: payment.status
      }
    };

    // Update the order status
    const result = await collection.updateOne(filter, updateDoc);
  }
  catch (err) {
   console.log(err);
  }
}

async function kafkaConnector (fastify, options) {
  const collection = fastify.mongo.db.collection('orders');

  const kfk = new Kafka(kafkaConnectionBinding);

  const consumer = kfk.consumer({groupId: groupId});

  await consumer.connect();
  await consumer.subscribe({ topics: topics, fromBeginning: true });

  consumer.run({
    eachMessage: async ({topic, message}) => {
      console.log(topic);
      console.log(message.value.toString());

      if (topic === 'orders') {
        processOrder(collection, message);
      }

      if (topic === 'payments') {
        processPayment(collection, message);
      }
    }
  });

}

module.exports = fastifyPlugin(kafkaConnector, {dependencies: ['mongo-connector']});