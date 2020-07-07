const express = require('express');
const _ = require('lodash');
const { isValidObjectId } = require('mongoose');
const { body: checkBody, validationResult } = require('express-validator');

const router = express.Router();
const passport = require('../libs/jwt-strategy');

const User = require('../models/user');
const { httpStatus } = require('../libs/codes');

const ValidationCallback = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      err: true,
      message: _.get(errors.array(), '[0].msg'),
    });
  }
  return next();
};

const userController = {
  create: async (req, res) => {
    try {
      const newUser = _.pick(req.body, ['userName', 'accountNumber', 'emailAddress', 'identityNumber']);
      const result = await User.create(newUser);

      return res.status(httpStatus.created).json({ success: true, data: result });
    } catch (error) {
      return res.status(httpStatus.badRequest).json({ err: true, message: error.message });
    }
  },
  get: async (req, res) => {
    try {
      const {
        accountNumber, identityNumber, page = 1, limit = 10,
      } = req.query;
      const filter = _.omitBy({ accountNumber, identityNumber }, _.isEmpty);

      const offset = Math.abs(((+page - 1) * limit));
      const result = await User.find({ ...filter }, null, { skip: offset, limit: +limit });
      return res.json({ data: result });
    } catch (error) {
      return res.status(error.statusCode || httpStatus.internalServerError).json({ err: true, message: error.message });
    }
  },
  update: async (req, res) => {
    try {
      const { id } = req.params;

      const update = _.pick(req.body, ['accountNumber', 'identityNumber', 'emailAddress', 'userName']);

      if (!isValidObjectId(id)) throw Object.assign(new Error('Invalid params id'), { statusCode: httpStatus.badRequest });
      const user = await User.findOne({ _id: id });

      if (!user) {
        throw Object.assign(new Error('User not found'), { statusCode: httpStatus.notFound });
      }

      const result = Object.assign(user, update);
      await result.save();

      return res.status(httpStatus.created).json({ data: result });
    } catch (error) {
      return res.status(error.statusCode || httpStatus.internalServerError).json({ err: true, message: error.message });
    }
  },
  delete: async (req, res) => {
    try {
      const { id } = req.params;

      if (!isValidObjectId(id)) throw Object.assign(new Error('Invalid params id'), { statusCode: httpStatus.badRequest });

      const user = await User.findOne({ _id: id });

      if (!user) {
        throw Object.assign(new Error('User not found'), { statusCode: httpStatus.notFound });
      }

      await User.findOneAndDelete({ _id: id });
      return res.status(httpStatus.ok).json({ message: 'user deleted' });
    } catch (error) {
      return res.status(error.statusCode || httpStatus.internalServerError).json({ err: true, message: error.message });
    }
  },
};

router.post('/', passport.authenticate, [
  checkBody('userName').exists().withMessage('Missing Parameters userName'),
  checkBody('accountNumber').exists().withMessage('Missing Parameters accountNumber'),
  checkBody('accountNumber').isInt().withMessage('Invalid accountNumber please input integer'),
  checkBody('identityNumber').exists().withMessage('Missing Parameters identityNumber'),
  checkBody('identityNumber').isInt().withMessage('Invalid identityNumber please input integer'),
  checkBody('emailAddress').exists().withMessage('Missing Parameters emailAddress'),
  ValidationCallback,
], userController.create);
router.get('/', passport.authenticate, userController.get);
router.put('/:id', passport.authenticate, [
  checkBody('userName').exists().withMessage('Missing Parameters userName'),
  checkBody('accountNumber').exists().withMessage('Missing Parameters accountNumber'),
  checkBody('accountNumber').isInt().withMessage('Invalid accountNumber please input integer'),
  checkBody('identityNumber').exists().withMessage('Missing Parameters identityNumber'),
  checkBody('identityNumber').isInt().withMessage('Invalid identityNumber please input integer'),
  checkBody('emailAddress').exists().withMessage('Missing Parameters emailAddress'),
  ValidationCallback,
], userController.update);
router.delete('/:id', passport.authenticate, userController.delete);

module.exports = router;
