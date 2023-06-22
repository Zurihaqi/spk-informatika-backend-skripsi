const { SENDER_EMAIL, CLIENT_ID, CLIENT_SECRET, REDIRECT_URL, REFRESH_TOKEN } =
  process.env;
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
const { promisify } = require("util");
const error = require("../misc/errorHandlers");

const oauth2Client = new OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL);

oauth2Client.setCredentials({
  refresh_token: REFRESH_TOKEN,
});

const sendEmail = async (receiver, subject, content) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: SENDER_EMAIL,
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: oauth2Client.getAccessToken(),
        accessType: "offline", // Set accessType to "offline"
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const mailOptions = {
      from: SENDER_EMAIL,
      to: receiver,
      subject: subject,
      html: content,
    };

    const sendMailAsync = promisify(transporter.sendMail).bind(transporter);
    const info = await sendMailAsync(mailOptions);
    return info;
  } catch (err) {
    console.error(err);
  }
};

module.exports = sendEmail;
