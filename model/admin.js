const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const adminSchema = mongoose.Schema(
  {
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    userRole: {
      type: String,
      enum: ["Admin", "SuperAdmin"],
      default: "Admin",
    },
  },
  { timestamps: true }
);

// for generating hased passwords
adminSchema.methods.generateHashedPassword = async function () {
  let salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
};

const Admin = mongoose.model("Admin", adminSchema);
module.exports.Admin = Admin;
