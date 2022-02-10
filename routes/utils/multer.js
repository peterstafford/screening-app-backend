const multer = require("multer");
const path = require("path");

// Multer config
module.exports = multer({
  storage: multer.diskStorage({}),
  fileFilter: (req, file, cb) => {
    let ext = path.extname(file.originalname);
    if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png") {
      req.fileValidationError = "Invalid File Format";
      return cb(null, false, req.fileValidationError);
    }
    cb(null, true);
  },
});
