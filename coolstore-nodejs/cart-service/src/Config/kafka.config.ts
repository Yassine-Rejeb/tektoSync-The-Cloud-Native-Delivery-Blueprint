import dotenv from 'dotenv';
import { Kafka, logLevel } from 'kafkajs';

dotenv.config();

const host = process.env.MY_CLUSTER_KAFKA_BOOTSTRAP_SERVICE_HOST || process.env['kafka_host'] || 'localhost';
const port = process.env.KAFKA_SERVICE_PORT || process.env['kafka_port'] || 9092;

// Create the Kafka Instance and such
const kafkaConnectionBinding = {
  brokers: [`${host}:${port}`],
  clientId: 'cart-service'
};

console.log('Kafka connection config', kafkaConnectionBinding);

export const TOPIC = 'orders';

let kfk: any;

export const getKafkaClient = () => {
  if (!kfk) {
    kfk = new Kafka(kafkaConnectionBinding);
    return kfk;
  }

  return kfk;
}