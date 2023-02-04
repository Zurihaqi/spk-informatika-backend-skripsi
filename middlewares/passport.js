const { JWT_SECRET } = process.env;
const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy,
  ExtractJwt = require("passport-jwt").ExtractJwt;
const options = {};
const errors = require("../misc/errorHandlers");
const { User } = require("../models");

options.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
options.secretOrKey = JWT_SECRET;

passport.use(
  new JwtStrategy(options, (jwt_payload, done) => {
    User.findOne({
      where: {
        id: jwt_payload.id,
        role: jwt_payload.role,
        name: jwt_payload.name,
        email: jwt_payload.email,
        profile_pic: jwt_payload.profile_pic,
      },
    })
      .then((user) => done(null, user))
      .catch((error) => done(error, false));
  })
);

module.exports = authentication = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (error, user, info) => {
    if (error) next(error);
    if (!user) {
      const error = errors.UNAUTHORIZED;
      return res.status(error.code).json({
        status: error.status,
        message: error.message,
      });
    }
    req.user = user;
    next();
  })(req, res, next);
};
