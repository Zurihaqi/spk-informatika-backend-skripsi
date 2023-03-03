const { User, Token } = require("../db/models");
const { JWT_SECRET } = process.env;
const error = require("../misc/errorHandlers");
const hash = require("../middlewares/passwordHashing");
const jwt = require("jsonwebtoken");

module.exports = {
  signIn: async (req, res, next) => {
    try {
      if (req.headers.authorization) {
        const tokenExist = await Token.findOne({
          where: {
            token: req.headers.authorization.match(/^Bearer (.*)$/)[1],
            isValid: true,
          },
        });
        if (tokenExist) {
          throw error.IN_SESSION;
        }
        throw error.INVALID_TOKEN;
      }
      const { email } = req.body;

      const validateEmail = (email) => {
        var re = /\S+@\S+\.\S+/;
        return re.test(email);
      };

      const isEmail = validateEmail(email);

      let options = {};

      isEmail
        ? (options = { where: { email: email } })
        : (options = { where: { student_id: email } });

      const userExist = await User.findOne(options);
      if (!userExist) throw error.INVALID_CRED;

      const passwordField = userExist.password.split("$");
      const salt = passwordField[0];
      const validatePassword = hash(req.body.password, salt);

      if (validatePassword === passwordField[1]) {
        const payload = {
          id: userExist.id,
          role: userExist.role,
          name: userExist.name,
          email: userExist.email,
          profile_pic: userExist.profile_pic,
        };

        const token = jwt.sign(payload, JWT_SECRET, {
          expiresIn: "1h",
        });

        await Token.create({
          token: token,
          isValid: true,
        });

        return res.status(201).json({
          status: "Success",
          message: "Login sukses",
          token: token,
        });
      }
      throw error.INVALID_CRED;
    } catch (err) {
      next(err);
    }
  },
  signUp: async (req, res, next) => {
    try {
      const { name, email } = req.body;

      const userExist = await User.findOne({ where: { email: email } });
      if (userExist) throw error.EMAIL_EXIST;

      const createUserResult = await User.create({
        name: name
          .replace(/\s+/g, " ")
          .replace(
            /(^\w|\s\w)(\S*)/g,
            (_, m1, m2) => m1.toUpperCase() + m2.toLowerCase()
          ),
        email: email,
        password: req.body.password,
      });
      if (createUserResult) {
        return res.status(201).json({
          status: "Success",
          message: "Register sukses",
          data: {
            id: createUserResult.id,
            name: createUserResult.name,
            email: createUserResult.email,
          },
        });
      }
    } catch (err) {
      next(err);
    }
  },
  signOut: async (req, res, next) => {
    try {
      if (req.headers.authorization) {
        const token = req.headers.authorization.match(/^Bearer (.*)$/)[1];
        if (token === req.user.token) {
          const invalidateToken = await Token.update(
            {
              isValid: false,
            },
            {
              where: { token: token, isValid: true },
              returning: true,
            }
          );
          if (invalidateToken[0] !== 0) {
            return res.status(200).json({
              status: "Success",
              message: "Berhasil Logout",
            });
          }
        }
      }
      throw error.OFF_SESSION;
    } catch (err) {
      next(err);
    }
  },
};
