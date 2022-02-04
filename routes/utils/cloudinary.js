const cloudinary = require("cloudinary").v2;
var config = require("config");


cloudinary.config({
  cloud_name: config.get("cloud_name"),
  api_key: config.get("api_key"),
  api_secret: config.get("api_secret"),
});

module.exports = cloudinary;
