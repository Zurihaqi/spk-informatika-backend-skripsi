const { User } = require("../db/models");
const { JWT_SECRET, AES_SECRET, WEBHOOK_URL_SECOND, RECAPTCHA_SECRET } =
  process.env;
const error = require("../misc/errorHandlers");
const hash = require("../middlewares/passwordHashing");
const jwt = require("jsonwebtoken");
const CryptoJS = require("crypto-js");
const fetch = require("node-fetch");

module.exports = {
  signIn: async (req, res, next) => {
    try {
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
      if (!userExist) throw error.UNREGISTERED;
      if (userExist.isVerified === false) throw error.NOT_VERIFIED;

      const passwordField = userExist.password.split("$");
      const salt = passwordField[0];
      const validatePassword = hash(req.body.password, salt);

      const encryptedRole = CryptoJS.AES.encrypt(
        userExist.role,
        AES_SECRET
      ).toString();
      const encryptedEmail = CryptoJS.AES.encrypt(
        userExist.email,
        AES_SECRET
      ).toString();
      const encryptedStudentId = CryptoJS.AES.encrypt(
        userExist.student_id,
        AES_SECRET
      ).toString();
      const encryptedName = CryptoJS.AES.encrypt(
        userExist.name,
        AES_SECRET
      ).toString();

      if (validatePassword === passwordField[1]) {
        const payload = {
          id: userExist.id,
          role: encryptedRole,
          name: encryptedName,
          student_id: encryptedStudentId,
          email: encryptedEmail,
          profile_pic: userExist.profile_pic,
        };

        const token = jwt.sign(payload, JWT_SECRET, {
          expiresIn: "1h",
        });

        return res.status(201).json({
          status: "Success",
          message: "Login sukses",
          token: token,
        });
      }
      throw error.WRONG_PASSWORD;
    } catch (err) {
      next(err);
    }
  },
  signUp: async (req, res, next) => {
    try {
      const { name, email, student_id } = req.body;

      const userExist = await User.findOne({ where: { email: email } });
      if (userExist) throw error.EMAIL_EXIST;

      const idExist = await User.findOne({ where: { student_id: student_id } });
      if (idExist) throw error.STUD_ID_EXIST;

      const createUserResult = await User.create({
        name: name
          .replace(/\s+/g, " ")
          .replace(
            /(^\w|\s\w)(\S*)/g,
            (_, m1, m2) => m1.toUpperCase() + m2.toLowerCase()
          ),
        email: email,
        student_id: student_id,
        password: req.body.password,
        isVerified: true,
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
  adminSignUp: async (req, res, next) => {
    try {
      const { name, email, reason } = req.body;

      const userExist = await User.findOne({ where: { email: email } });
      if (userExist) throw error.EMAIL_EXIST;

      const url = WEBHOOK_URL_SECOND;

      const webhookBody = {
        embeds: [
          {
            title: "Pendaftaran Pengelola",
            fields: [
              { name: "Pengirim:", value: name },
              { name: "Email:", value: email },
              { name: "Alasan:", value: reason },
            ],
          },
        ],
      };

      const sendMessage = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(webhookBody),
      });

      if (!sendMessage) throw error.WEBHOOK_FAIL;

      const createUserResult = await User.create({
        name: name
          .replace(/\s+/g, " ")
          .replace(
            /(^\w|\s\w)(\S*)/g,
            (_, m1, m2) => m1.toUpperCase() + m2.toLowerCase()
          ),
        email: email,
        password: req.body.password,
        role: "Pengelola",
      });
      if (createUserResult) {
        return res.status(201).json({
          status: "Success",
          message: "Register pengelola sukses",
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
  verifyCaptcha: async (req, res, next) => {
    try {
      const { response_key } = req.body;
      const url = `https://www.google.com/recaptcha/api/siteverify?secret=${RECAPTCHA_SECRET}&response=${response_key}`;

      const verify = await fetch(url, {
        method: "post",
      });
      const google_response = await verify.json();

      if (!google_response.success) throw error.RECAPTCHA_FAIL;

      return res.status(201).json({
        status: "Success",
        message: "Recaptcha berhasil diverifikasi.",
      });
    } catch (err) {
      next(err);
    }
  },
};
