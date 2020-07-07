const express = require('express');
const jwt = require('jsonwebtoken');

const router = express.Router();

const SECRET = process.env.SECRET || 'secret';

const { httpStatus } = require('../libs/codes');

const tokenController = {
  generate: async (req, res) => {
    try {
      const token = jwt.sign(Buffer.from(process.env.DB_NAME).toString(), SECRET);
      return res.json({ token });
    } catch (error) {
      return res
        .status(httpStatus.internalServerError)
        .json({ err: true, message: error.message });
    }
  },
};

router.get('/', tokenController.generate);

module.exports = router;
