const { JWT_SECRET } = process.env;
const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy,
  ExtractJwt = require("passport-jwt").ExtractJwt;
const opts = {};
const errors = require("../misc/errorHandlers");
const { User, Token } = require("../db/models");

opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = JWT_SECRET;

passport.use(
  new JwtStrategy(opts, (jwt_payload, done) => {
    User.findOne({
      where: {
        id: jwt_payload.id,
        email: jwt_payload.email,
      },
    })
      .then((result) => done(null, result))
      .catch((error) => done(error, false));
  })
);

module.exports = authentication = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (error, user, info) => {
    if (!user) {
      error = errors.UNAUTHORIZED;
    }
    if (error) return next(error);

    req.user = user;

    next();
  })(req, res, next);
};
