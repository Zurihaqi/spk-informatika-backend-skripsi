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
  UNAUTHORIZED_ADMIN: new apiError(
    401,
    "Unauthorized",
    "Anda tidak memiliki hak akses ke endpoint ini."
  ),
  FILE_SIZE: new apiError(400, "Error", "Ukuran file gambar terlalu besar"),
  INVALID_FORMAT: new apiError(
    400,
    "Error",
    "Format yang diperbolehkan: png, jpg, jpeg, webp"
  ),
  INVALID_FORMAT_GIF: new apiError(
    400,
    "Error",
    "Format yang diperbolehkan: png, jpg, jpeg, webp, gif"
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
  UNREGISTERED: new apiError(401, "Unauthorized", "Email/NPM belum terdaftar."),
  STUD_ID_EXIST: new apiError(
    400,
    "Error",
    "Nomor Pokok Mahasiswa tersebut sudah terdaftar."
  ),
  FILE_COUNT: new apiError(400, "Error", "Hanya dapat mengunggah 1 gambar."),
  USER_NOT_FOUND: new apiError(
    404,
    "Not Found",
    "User yang dicari tidak ditemukan."
  ),
  COURSE_SPEC_ASSOC: new apiError(
    401,
    "Error",
    "Mata kuliah masih digunakan untuk perhitungan SPK."
  ),
};
