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
      },
    })
      .then(() => done(null, jwt_payload))
      .catch((error) => done(error, false));
  })
);

module.exports = authentication = (req, res, next) => {
  const token = `${req.headers.authorization.match(/^Bearer (.*)$/)[1]}`;

  passport.authenticate(
    "jwt",
    { session: false },
    async (error, user, info) => {
      const validToken = await Token.findOne({
        where: { token: token, isValid: true },
      });

      if (!user || !validToken) error = errors.UNAUTHORIZED;
      if (error) return next(error);

      req.user = user;
      req.user.token = token;

      next();
    }
  )(req, res, next);
};
