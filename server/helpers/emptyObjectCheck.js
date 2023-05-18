//Fungsi untuk cek apakah objek kosong
module.exports = isEmpty = (obj) => {
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) return false;
  }
  return true;
};
