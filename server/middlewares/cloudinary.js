const { CLOUD_NAME, API_KEY, API_SECRET } = process.env;
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: API_KEY,
  api_secret: API_SECRET,
});

const cloudinaryUpload = async (req, res, next) => {
  try {
    if (req.file) {
      if (req.user.profile_pic) {
        const myAssetIndex = req.user.profile_pic.indexOf("my-asset");
        const extractedString = req.user.profile_pic
          .substring(myAssetIndex)
          .split(".");
        await cloudinary.uploader.destroy(extractedString[0].toString());
      }
      const foldering = `my-asset/profile`;
      const file = req.file;
      const uploadResult = await cloudinary.uploader.upload(file.path, {
        folder: foldering,
        use_filename: true,
        resource_type: "image",
        upload_preset: req.user.role === "Admin" ? "auehv040" : "glahtyih",
      });
      if (file.fieldname === "profile_pic")
        req.body.profile_pic = uploadResult.secure_url;

      return next();
    }
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = cloudinaryUpload;
