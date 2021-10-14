const { Admin } = require("../../model/admin");
const { Token } = require("../../model/token");
const passwordResetEmail = require("../../email/passwordResetEmail");
const crypto = require("crypto");
const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const admin = await Admin.findOne({ email: req.body.email });
    if (!admin)
      return res.status(400).send("user with given email doesn't exist");

    let token = await Token.findOne({ adminId: admin._id });
    if (!token) {
      token = await new Token({
        adminId: admin._id,
        token: crypto.randomBytes(32).toString("hex"),
      }).save();
    }

    const link = `https://rmhcsdwellness.safebusinesssolutions.com/forgot-password/${admin._id}/${token.token}`;
    await passwordResetEmail(admin.email, "Password Reset", link);

    res.send("password reset link sent to your email account");
  } catch (error) {
    res.send("An error occured");
    console.log(error);
  }
});

router.post("/:adminId/:token", async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.adminId);
    if (!admin) return res.status(400).send("invalid link or expired");

    const token = await Token.findOne({
      adminId: admin._id,
      token: req.params.token,
    });
    if (!token) return res.status(400).send("Invalid link or expired");

    admin.password = req.body.password;
    await admin.generateHashedPassword();
    await admin.save();
    await token.delete();

    res.send("password reset sucessfully.");
  } catch (error) {
    res.send("An error occured");
    console.log(error);
  }
});

module.exports = router;
