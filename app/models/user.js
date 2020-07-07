const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema({
  userName: {
    type: String,
    minlength: [4, 'userName must be at least 4 character long'],
  },

  accountNumber: {
    type: Number,
    index: true,
  },

  emailAddress: {
    type: String,
    validate: [
      {
        // eslint-disable-next-line
        validator: (value) => /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(value),
        message: 'Invalid email format',
      },
      {
        isAsync: true,
        validator(value, callback) {
          return new Promise((resolve, reject) => {
          // eslint-disable-next-line no-use-before-define
            return User.findOne({ emailAddress: value })
              .then((user) => {
                // eslint-disable-next-line no-underscore-dangle
                if (user && user._id.toString() !== this._id.toString()) {
                  return reject(new Error('this email is taken. please use another email.'));
                }
                return resolve();
              })
              .catch((err) => {
                callback(err);
              });
          });
        },
      },
    ],
  },

  identityNumber: {
    type: Number,
  },
});

userSchema.index({ accountNumber: 1, identityNumber: 1 });
const User = mongoose.model('User', userSchema);

module.exports = User;
