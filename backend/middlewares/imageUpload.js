const multer = require("multer");
const path = require("path");

// Destino da iamgem
const imageStore = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = "";

    if (req.baseUrl.includes("users")) {
      folder = "users";
    } else if (req.baseUrl.includes("photos")) {
      folder = "photos";
    }

    cb(null, `uploads/${folder}/`);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const imageUpload = multer({
  storage: imageStore,
  fileFilter: (req, file, cb) => {
    if (!file.originalname.match(/\.(png|jpg)$/)) {
      // Upload só png e jpg
      return cb(new Error("Por favor, envie apenas arquios png ou jpg"));
    }
    cb(undefined, true);
  },
});

module.exports = { imageUpload };
