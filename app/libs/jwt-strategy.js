const passport = require('passport');
const passportJWT = require('passport-jwt');

const { httpStatus } = require('./codes');

const SECRET = process.env.SECRET || 'secret';

const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

const options = {
  jwtFromRequest: ExtractJWT.fromHeader('authorization'),
  secretOrKey: SECRET,
  passReqToCallback: false,
};

const jwtMiddleware = (jwtPayload, done) => {
  if (jwtPayload !== process.env.DB_NAME) {
    done('Invalid token');
  }
  done(null, jwtPayload);
};

const strategy = new JWTStrategy(options, jwtMiddleware);

passport.use(strategy);

module.exports = {
  authenticate: (req, res, next) => passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (err) {
      return res.status(httpStatus.badRequest).json({ message: err });
    }
    return next(null);
  })(req, res, next),
};
