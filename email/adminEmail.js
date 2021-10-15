const nodemailer = require("nodemailer");
var config = require("config");
const { Admin } = require("../model/admin");
const moment = require("moment");

const sendAdminEmail = async (subject, text) => {
  let date = new Date();
  let FDate = moment(date).format("MM-DD-YYYY");
  var transporter = nodemailer.createTransport({
    host: "smtpout.secureserver.net",
    port: 465,
    auth: {
      user: config.get("email"),
      pass: config.get("password"),
    },
  });
  let admin = await Admin.find({ userRole: "Admin" });
  let sendAdminEmail = [];
  admin.map((item) => {
    sendAdminEmail.push(item.email);
  });
  message = {
    from: "RMHCSD - Ronald McDonald House Charities - San Diego <no-reply@blog.com>",
    to: sendAdminEmail,
    subject: "Wellness Screening Alert❗️❗️❗️ ⚠️",
    html: `<h4>Please follow up with the following party on Wellness Screening. ${text} </h4>`,
  };

  transporter.sendMail(message, function (err, info) {
    if (err) {
      console.log(err);
    } else {
      console.log(info);
    }
  });
};
module.exports = sendAdminEmail;
