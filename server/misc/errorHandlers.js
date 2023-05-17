class ApiError extends Error {
  constructor(code, message) {
    super(message);
    this.code = code;
  }

  toJson() {
    return {
      code: this.code,
      status: this.getStatus(),
      message: this.message,
    };
  }

  getStatus() {
    switch (this.code) {
      case 401:
        return "Unauthorized";
      case 404:
        return "Not Found";
      case 409:
        return "Duplicate";
      case 400:
      default:
        return "Error";
    }
  }
}

module.exports = {
  UNAUTHORIZED: new ApiError(401, "Login untuk menggunakan API"),
  EMAIL_EXIST: new ApiError(401, "User dengan email tersebut sudah terdaftar"),
  INVALID_CRED: new ApiError(401, "Email atau kata sandi salah"),
  EMPTY_TABLE: new ApiError(404, "Tabel kosong"),
  DUPLICATE_DATA: new ApiError(
    409,
    "Data yang ingin dibuat sudah ada dalam database"
  ),
  DATA_NOT_FOUND: new ApiError(404, "Data yang dicari tidak ditemukan."),
  DATA_FK: new ApiError(401, "Data masih tersimpan pada tabel lain."),
  EMPTY_BODY: new ApiError(404, "Masukkan data yang ingin diubah"),
  FK_NOT_FOUND: new ApiError(404, "Data FK yang dituju tidak ditemukan"),
  INVALID_GRADE: new ApiError(400, "Nilai yang dimasukkan tidak valid"),
  UNAUTHORIZED_ADMIN: new ApiError(
    401,
    "Anda tidak memiliki hak akses ke endpoint ini."
  ),
  FILE_SIZE: new ApiError(400, "Ukuran file gambar terlalu besar"),
  INVALID_FORMAT: new ApiError(
    400,
    "Format yang diperbolehkan: png, jpg, jpeg, webp"
  ),
  INVALID_FORMAT_GIF: new ApiError(
    400,
    "Format yang diperbolehkan: png, jpg, jpeg, webp, gif"
  ),
  GRADE_NOT_FOUND: new ApiError(
    400,
    "Harap masukkan semua nilai terlebih dahulu."
  ),
  RULE_NOT_FOUND: new ApiError(400, "Belum ada rule untuk peminatan ini"),
  WRONG_PASSWORD: new ApiError(400, "Kata sandi salah."),
  FIS_ERROR: new ApiError(
    500,
    "Terjadi kesalahan dalam perhitungan. Harap laporkan masalah ini."
  ),
  UNREGISTERED: new ApiError(401, "Email/NPM belum terdaftar."),
  STUD_ID_EXIST: new ApiError(
    400,
    "Nomor Pokok Mahasiswa tersebut sudah terdaftar."
  ),
  FILE_COUNT: new ApiError(400, "Hanya dapat mengunggah 1 gambar."),
  USER_NOT_FOUND: new ApiError(404, "User yang dicari tidak ditemukan."),
  COURSE_SPEC_ASSOC: new ApiError(
    401,
    "Mata kuliah masih digunakan untuk perhitungan SPK."
  ),
  NOT_VERIFIED: new ApiError(401, "Akun menunggu persetujuan admin."),
  WEBHOOK_FAIL: new ApiError(400, "Gagal mengirimkan pesan."),
  RECAPTCHA_FAIL: new ApiError(400, "Gagal memverifikasi reCAPTCHA."),
};
