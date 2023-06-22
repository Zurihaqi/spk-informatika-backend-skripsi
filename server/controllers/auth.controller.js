const { User, Notification } = require("../db/models");
const { JWT_SECRET, AES_SECRET, WEBHOOK_URL_SECOND, RECAPTCHA_SECRET } =
  process.env;
const error = require("../misc/errorHandlers");
const hash = require("../middlewares/passwordHashing");
const jwt = require("jsonwebtoken");
const CryptoJS = require("crypto-js");
const crypto = require("crypto");
const fetch = require("node-fetch");
const mailer = require("../middlewares/mailer");
const fs = require("fs");
const path = require("path");

module.exports = {
  //Controller untuk login
  signIn: async (req, res, next) => {
    try {
      const { email } = req.body;
      const isEmail = validateEmail(email);

      //Cek apakah kolom email berisi alamat email atau NPM
      const options = isEmail
        ? { where: { email } }
        : { where: { student_id: email } };
      const userExist = await User.findOne(options);

      //Error ketika user belum terdaftar
      if (!userExist) throw error.UNREGISTERED;

      //Error ketika pengelola belum diverifikasi admin
      if (!userExist.isVerified) throw error.NOT_VERIFIED;

      //Validasi password yang dimasukkan
      const validatePassword = hash(
        req.body.password,
        userExist.password.split("$")[0]
      );
      if (validatePassword !== userExist.password.split("$")[1]) {
        throw error.WRONG_PASSWORD;
      }

      //Enkripsi data user untuk digunakan dalam payload
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

  //Controller untuk pendaftaran akun mahasiswa
  signUp: async (req, res, next) => {
    try {
      const { name, email, student_id } = req.body;

      //Cek apakah email sudah terdaftar
      const userExist = await User.findOne({ where: { email } });
      if (userExist) throw error.EMAIL_EXIST;

      //Cek apakah NPM sudah terdaftar
      const idExist = await User.findOne({ where: { student_id } });
      if (idExist) throw error.STUD_ID_EXIST;

      const createUserResult = await User.create({
        name: formatName(name),
        email,
        student_id,
        password: req.body.password,
        isVerified: true,
      });

      //Mengirimkan notifikasi pada user ketika akun berhasil dibuat
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

  //Controller untuk pendaftaran akun pengelola
  adminSignUp: async (req, res, next) => {
    try {
      const { name, email, reason } = req.body;

      //Cek apakah email sudah terdaftar
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

      //Mengirimkan pesan melalui webhook Discord apabila ada pendaftar pengelola baru
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

      //Mengirimkan notifikasi pada user ketika akun berhasil dibuat
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

  //Verifikasi recaptcha
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

  //Lupa Password
  forgotPass: async (req, res, next) => {
    try {
      const { email } = req.body;
      const otp = crypto.randomBytes(20).toString("hex");

      const userExist = await User.findOne({ where: { email } });
      if (!userExist) throw error.UNREGISTERED2;

      const filePath = path.join(
        __dirname,
        "../../public/mailer-template/password-reset.html"
      );

      let htmlContent = fs.readFileSync(filePath, "utf-8");
      const resetLink = `https://spk-informatika.vercel.app/reset-password/${otp}%26${userExist.id}`;
      htmlContent = htmlContent.replace("{{resetLink}}", resetLink);

      const insertOTP = await User.update(
        {
          otp: otp,
        },
        { where: { email }, individualHooks: true }
      );

      if (insertOTP) {
        const emailResponse = await mailer(
          email,
          "Atur ulang kata sandi",
          htmlContent
        );

        if (emailResponse) {
          return res.status(201).json({
            status: "Success",
          });
        }
        throw error.MAILER_FAIL;
      }
    } catch (err) {
      next(err);
    }
  },

  //Validasi lupa sandi
  forgotPassValidate: async (req, res, next) => {
    try {
      const { otp, password, user_id } = req.body;
      const { beforeLoad } = req.query;

      const user = await User.findByPk(user_id);

      if (beforeLoad) {
        const validateOtp = user.otp
          ? hash(otp, user.otp.split("$")[0])
          : false;
        if (!validateOtp) {
          throw error.INVALID_OTP;
        }
        return res.status(201).json({
          status: "Verified",
        });
      }

      const validateOtp = user.otp ? hash(otp, user.otp.split("$")[0]) : false;
      if (!validateOtp) {
        throw error.INVALID_OTP;
      }

      await User.update(
        { password },
        { where: { id: user.id }, individualHooks: true }
      );

      await User.update({ otp: null }, { where: { id: user.id } });

      await Notification.create({
        content: "Kata Sandi anda telah diubah.",
        user_id: user_id,
      });

      return res.status(201).json({
        status: "Success",
      });
    } catch (err) {
      next(err);
    }
  },
};

//Validasi email
function validateEmail(email) {
  const re = /\S+@\S+\.\S+/;
  return re.test(email);
}

//Sanitasi nama
function formatName(name) {
  return name
    .replace(/\s+/g, " ")
    .replace(
      /(^\w|\s\w)(\S*)/g,
      (_, m1, m2) => m1.toUpperCase() + m2.toLowerCase()
    );
}

//Enkripsi data payload jwt
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
