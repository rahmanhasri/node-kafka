const express = require('express');
const passport = require('passport');
const mongooseConnect = require('./libs/mongo-connection');

require('dotenv').config();

const app = express();

const PORT = process.env.PORT || 3000;

const userRoutes = require('./routes/user');
const tokenRoutes = require('./routes/token');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(passport.initialize());

mongooseConnect();

app.use('/token', tokenRoutes);
app.use('/user', userRoutes);

app.use('*', (req, res, next) => {
  console.log(req);
  next();
});

app.listen(PORT, () => {
  console.log('this is listening to port:', PORT);
});
