const nodemailer = require("nodemailer");
var config = require("config");
const { Admin } = require("../model/admin");
const moment = require("moment");

const questionareChangedEmail = async (subject, text) => {
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
  let admin = await Admin.find({ userRole: "SuperAdmin" });
  let sendAdminEmail = [];
  admin.map((item) => {
    sendAdminEmail.push(item.email);
  });
  message = {
    from: "RMHCSD - Ronald McDonald House Charities - San Diego <no-reply@blog.com>",
    to: sendAdminEmail,
    subject: subject,
    html: `<h4>The Following User Have Changed Questionare :- </h4><br>${text}`,
  };

  transporter.sendMail(message, function (err, info) {
    if (err) {
      console.log(err);
    } else {
      console.log(info);
    }
  });
};
module.exports = questionareChangedEmail;
