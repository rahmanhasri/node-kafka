const Kafka = require('./connection');

async function init() {
  const producer = Kafka.producer();
  await producer.connect();
  await producer.send({
    topic: 'test',
    messages: [
      { value: '{"emailAddress":"hello@gmail.com","userName":"hello","identityNumber":"12345","accountNumber":"98765"}' },
    ],
  });

  await producer.disconnect();
}

init();
