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
    "Login untuk menggukanan API."
  ),
  EMAIL_EXIST: new apiError(
    401,
    "Unauthorized",
    `User dengan email tersebut sudah terdaftar.`
  ),
  INVALID_CRED: new apiError(401, "Unauthorized", "Email atau password salah."),
  EMPTY_TABLE: new apiError(404, "Not Found", "Tabel kosong."),
  DUPLICATE_DATA: new apiError(
    409,
    "Error",
    "Data yang ingin dibuat sudah ada dalam database."
  ),
  DATA_NOT_FOUND: new apiError(
    404,
    "Not Found",
    "Data yang dicari tidak ditemukan."
  ),
  DATA_FK: new apiError(401, "Error", "Data masih tersimpan pada tabel lain."),
  EMPTY_BODY: new apiError(404, "Error", "Masukkan data yang ingin diupdate."),
  FK_NOT_FOUND: new apiError(
    404,
    "Error",
    "Data FK yang dituju tidak ditemukan"
  ),
  INVALID_GRADE: new apiError(
    400,
    "Error",
    "Nilai yang dimasukkan tidak valid"
  ),
  UNAUTHORIZED_ROLE: new apiError(
    401,
    "Unauthorized",
    "Hanya admin yang dapat mengakses endpoint ini"
  ),
  FILE_SIZE: new apiError(400, "Error", "Ukuran file gambar terlalu besar"),
};
