const mongooseConnect = require('../app/libs/mongo-connection');
const Kafka = require('./connection');
const User = require('../app/models/user');

module.exports = ({
  start: async () => {
    mongooseConnect();
    const consumer = Kafka.consumer({ groupId: 'test-group' });

    await consumer.connect();
    await consumer.subscribe({ topic: 'test' });

    await consumer.run({
      eachMessage: async ({ message }) => {
        try {
          const data = JSON.parse(message.value);
          await User.create(data).then((newUser) => {
            console.log(newUser);
          });
        } catch (error) {
          console.log('ERR:', error);
        }
      },
    });
  },
});
