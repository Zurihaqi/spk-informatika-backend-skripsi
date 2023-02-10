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

      //Cek apakah email belum terdaftar
      const userExist = await User.findOne({ where: { email: email } });
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

        req.token = token;

        return res.status(201).json({
          status: "Success",
          message: "Login sukses",
          token: token,
        });
      }
      throw error.INVALID_CRED; //Password salah
    } catch (err) {
      next(err);
    }
  },
  signUp: async (req, res, next) => {
    try {
      const { name, email } = req.body;

      //Cek apakah email sudah terdaftar
      const userExist = await User.findOne({ where: { email: email } });
      if (userExist) throw error.EMAIL_EXIST;

      const createUserResult = await User.create({
        role: "User",
        name: name,
        email: email,
        password: req.body.password,
      });
      if (createUserResult) {
        return res.status(201).json({
          status: "Success",
          message: "Register sukses",
          data: { name: createUserResult.name, email: createUserResult.email },
        });
      }
    } catch (err) {
      next(err);
    }
  },
  signOut: async (req, res, next) => {
    try {
      if (req.user) {
        const token = req.user.token;
        if (token) {
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
