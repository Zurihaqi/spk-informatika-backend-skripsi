const { User, Notification } = require("../db/models");
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
      const isEmail = validateEmail(email);

      const options = isEmail
        ? { where: { email } }
        : { where: { student_id: email } };
      const userExist = await User.findOne(options);

      if (!userExist) throw error.UNREGISTERED;
      if (!userExist.isVerified) throw error.NOT_VERIFIED;

      const validatePassword = hash(
        req.body.password,
        userExist.password.split("$")[0]
      );
      if (validatePassword !== userExist.password.split("$")[1]) {
        throw error.WRONG_PASSWORD;
      }

      const encryptedUser = encryptUserFields(userExist);

      const token = jwt.sign(encryptedUser, JWT_SECRET, { expiresIn: "1h" });

      return res.status(201).json({
        status: "Success",
        message: "Login sukses",
        token,
      });
    } catch (err) {
      next(err);
    }
  },

  signUp: async (req, res, next) => {
    try {
      const { name, email, student_id } = req.body;

      const userExist = await User.findOne({ where: { email } });
      if (userExist) throw error.EMAIL_EXIST;

      const idExist = await User.findOne({ where: { student_id } });
      if (idExist) throw error.STUD_ID_EXIST;

      const createUserResult = await User.create({
        name: formatName(name),
        email,
        student_id,
        password: req.body.password,
        isVerified: true,
      });

      await Notification.create({
        content: "Selamat datang di SPK Informatika!",
        user_id: createUserResult.id,
      });

      return res.status(201).json({
        status: "Success",
        message: "Register sukses",
        data: {
          id: createUserResult.id,
          name: createUserResult.name,
          email: createUserResult.email,
        },
      });
    } catch (err) {
      next(err);
    }
  },

  adminSignUp: async (req, res, next) => {
    try {
      const { name, email, reason } = req.body;

      const userExist = await User.findOne({ where: { email } });
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

      if (!sendMessage.ok) {
        throw error.WEBHOOK_FAIL;
      }

      const createUserResult = await User.create({
        name: formatName(name),
        email,
        password: req.body.password,
        role: "Pengelola",
      });

      await Notification.create({
        content: "Selamat datang di SPK Informatika!",
        user_id: createUserResult.id,
      });

      return res.status(201).json({
        status: "Success",
        message: "Register pengelola sukses",
        data: {
          id: createUserResult.id,
          name: createUserResult.name,
          email: createUserResult.email,
        },
      });
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

function validateEmail(email) {
  const re = /\S+@\S+\.\S+/;
  return re.test(email);
}

function formatName(name) {
  return name
    .replace(/\s+/g, " ")
    .replace(
      /(^\w|\s\w)(\S*)/g,
      (_, m1, m2) => m1.toUpperCase() + m2.toLowerCase()
    );
}

function encryptUserFields(user) {
  const { role, name, student_id, email } = user;

  return {
    id: user.id,
    role: CryptoJS.AES.encrypt(role, AES_SECRET).toString(),
    name: CryptoJS.AES.encrypt(name, AES_SECRET).toString(),
    student_id: CryptoJS.AES.encrypt(student_id, AES_SECRET).toString(),
    email: CryptoJS.AES.encrypt(email, AES_SECRET).toString(),
    profile_pic: user.profile_pic,
  };
}
