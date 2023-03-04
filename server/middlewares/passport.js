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
      .then(() => done(null, jwt_payload))
      .catch((error) => done(error, false));
  })
);

module.exports = authentication = (req, res, next) => {
  passport.authenticate(
    "jwt",
    { session: false },
    async (error, user, info) => {
      let validToken;
      if (req.headers.authorization) {
        const token = `${req.headers.authorization.match(/^Bearer (.*)$/)[1]}`;

        validToken = await Token.findOne({
          where: { token: token, isValid: true },
        });

        if (validToken) {
          req.user = user;
          req.user.token = token;
          if (new Date() - validToken.createdAt > 60 * 60 * 1000) {
            error = errors.TOKEN_EXPIRED;
          }
        }
      }
      if (!user || !validToken || !req.headers.authorization) {
        error = errors.UNAUTHORIZED;
      }
      if (error) return next(error);

      next();
    }
  )(req, res, next);
};
