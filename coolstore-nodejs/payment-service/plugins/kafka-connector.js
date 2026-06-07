'use strict';

const fastifyPlugin = require('fastify-plugin');
const { Kafka, logLevel } = require('kafkajs');
const { setTimeout } = require('node:timers/promises');

const consumerGroupId = 'consumer-orders-payments';
const consumerTopic = 'orders';

const producerGroupId = 'producer-payments';
const producerTopic = 'payments'

const host = process.env.MY_CLUSTER_KAFKA_BOOTSTRAP_SERVICE_HOST || process.env['kafka_host'] || 'localhost';
const port = process.env.KAFKA_SERVICE_PORT || process.env['kafka_port'] || 9092;

// Create the Kafka Instance and such
const kafkaConnectionBinding = {
  brokers: [`${host}:${port}`],
  clientId: 'order-service-consumer'
};

async function checkPaymentInfo(producer, order) {
  const payment = {
    orderId: order.orderId
  };

  // Fake processing time?
  await setTimeout(5000);
  // Check the payment information
  // Starts with a 4 then good
  if (order.creditCard.number.startsWith('4')) {
    payment.remark = `Payment of ${order.total} succeeded for ${order.name} CC Number: ${order.creditCard.number}`;
    payment.status = 'COMPLETED';
  } else {
    // FAILED
    payment.remark = `Invalid Credit Card: ${order.creditCard.number}`;
    payment.status = 'FAILED';
  }
  // Produce a new message to the payment topic
  const paymentMessage = {
    key: payment.orderId,
    value: JSON.stringify(payment)
  };

  try {
    await producer.send({
      topic: producerTopic,
      messages: [paymentMessage]
    });
  } catch (err) {
    console.log('Error with sending to Payment topic', err);
  }
}

async function kafkaConnector (fastify, options) {
  const kfk = new Kafka(kafkaConnectionBinding);

  const consumer = kfk.consumer({groupId: consumerGroupId});
  const producer = kfk.producer();

  await consumer.connect();
  await producer.connect();
  // Subscribe to the Orders topic so we can get and check the CC info
  await consumer.subscribe({ topics: [consumerTopic], fromBeginning: true });

  consumer.run({
    eachMessage: async ({topic, message}) => {
      console.log(topic);
      console.log(message.value.toString());
      try {
        checkPaymentInfo(producer, JSON.parse(message.value.toString()));
      } catch(err) {
        console.log(err);
      }
    }
  });
}

module.exports = fastifyPlugin(kafkaConnector);