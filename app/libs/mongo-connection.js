const mongoose = require('mongoose');
require('dotenv').config();

module.exports = () => {
  const DB_NAME = process.env.DB_NAME || 'rahmanhasri';
  const DB_HOST = process.env.DB_HOST || 'localhost';
  const stringConnection = `mongodb://${DB_HOST}:27017/${DB_NAME}`;

  const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  };

  mongoose.connect(stringConnection, options);
};
