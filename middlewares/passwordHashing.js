const crypto = require("crypto");

const hash = (password, salt) => {
  let salted = false;
  if (!salt) {
    salt = crypto.randomBytes(16).toString("base64");
    salted = true; //lmao
  }

  const hashed = crypto
    .createHmac("sha512", salt)
    .update(password)
    .digest("base64");

  if (salted) {
    return `${salt}$${hashed}`;
  }
  return hashed;
};

module.exports = hash;
