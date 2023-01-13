class apiError extends Error {
  constructor(code, status, message) {
    super(message);
    this.code = code;
    this.status = status;
  }
}

module.exports = {
  UNAUTHORIZED: new apiError(401, "Unauthorized", "Login to use this API"),
  EMAIL_EXIST: new apiError(
    401,
    "Unauthorized",
    `User dengan email tersebut sudah terdaftar.`
  ),
  INVALID_CRED: new apiError(401, "Unauthorized", "Email atau password salah."),
};
