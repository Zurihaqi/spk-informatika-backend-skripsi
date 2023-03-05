class apiError extends Error {
  constructor(code, status, message) {
    super(message);
    this.code = code;
    this.status = status;
  }
}

module.exports = {
  UNAUTHORIZED: new apiError(
    401,
    "Unauthorized",
    "Login untuk menggukanan API"
  ),
  EMAIL_EXIST: new apiError(
    401,
    "Unauthorized",
    `User dengan email tersebut sudah terdaftar`
  ),
  INVALID_CRED: new apiError(
    401,
    "Unauthorized",
    "Email atau kata sandi salah"
  ),
  EMPTY_TABLE: new apiError(404, "Not Found", "Tabel kosong"),
  DUPLICATE_DATA: new apiError(
    409,
    "Duplicate",
    "Data yang ingin dibuat sudah ada dalam database"
  ),
  DATA_NOT_FOUND: new apiError(
    404,
    "Not Found",
    "Data yang dicari tidak ditemukan."
  ),
  DATA_FK: new apiError(401, "Error", "Data masih tersimpan pada tabel lain."),
  EMPTY_BODY: new apiError(404, "Error", "Masukan data yang ingin diubah"),
  FK_NOT_FOUND: new apiError(
    404,
    "Not Found",
    "Data FK yang dituju tidak ditemukan"
  ),
  INVALID_GRADE: new apiError(400, "Error", "Nilai yang dimasukan tidak valid"),
  UNAUTHORIZED_ROLE: new apiError(
    401,
    "Unauthorized",
    "Hanya admin yang dapat mengakses endpoint ini"
  ),
  FILE_SIZE: new apiError(400, "Error", "Ukuran file gambar terlalu besar"),
  IN_SESSION: new apiError(400, "Error", "Anda sudah melakukan login"),
  OFF_SESSION: new apiError(400, "Error", "Anda belum melakukan login"),
  INVALID_TOKEN: new apiError(400, "Error", "Token tidak valid"),
  TOKEN_EXPIRED: new apiError(
    401,
    "Unauthorized",
    "Sesi sudah habis. Lakukan login ulang."
  ),
  INVALID_FORMAT: new apiError(
    400,
    "Error",
    "Format yang diperbolehkan: png, jpg, jpeg, webp"
  ),
  GRADE_NOT_FOUND: new apiError(
    400,
    "Error",
    "Harap masukan semua nilai terlebih dahulu."
  ),
  RULE_NOT_FOUND: new apiError(
    400,
    "Error",
    "Belum ada rule untuk peminatan ini"
  ),
  WRONG_PASSWORD: new apiError(400, "Error", "Kata sandi salah."),
  FIS_ERROR: new apiError(
    500,
    "Error",
    "Terjadi kesalahan dalam perhitungan. Harap laporkan masalah ini."
  ),
};
