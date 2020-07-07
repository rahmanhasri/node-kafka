const { Kafka } = require('kafkajs');

module.exports = new Kafka({
  clientId: 'my-app',
  brokers: ['kafka:9092'],
});
