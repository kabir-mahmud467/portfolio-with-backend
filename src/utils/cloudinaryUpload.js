const { cloudinary } = require("../config/cloudinary");

async function uploadBufferToCloudinary(file, folder = "kabir-portfolio") {
  if (!file) return null;

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        resolve({
          url: result.secure_url,
          publicId: result.public_id
        });
      }
    );

    stream.end(file.buffer);
  });
}

module.exports = { uploadBufferToCloudinary };

