const nodemailer = require("nodemailer");
const Email = require("email-templates");
let cron = require("node-cron");
var config = require("config");
// var Logo = require("../public/images/logo.png");
const { User } = require("../model/user");
const moment = require("moment");

const emailAfterConsentForm = async function (emailUser) {
  // let date_ob = new Date();
  // let Date = year + "-" + month + "-" + date;
  var transporter = nodemailer.createTransport({
    host: "smtpout.secureserver.net",
    port: 465,
    auth: {
      user: config.get("email"),
      pass: config.get("password"),
    },
  });

  const email = new Email({
    transport: transporter,
    send: true,
    preview: false,
  });
  let user = await User.find({ email: emailUser });
  console.log(user);
  let date = new Date();
  let FDate = moment(date, "hh").format("YYYY-MM-DD LT");
  email
    .send({
      template: `consentFormAfterEmail`,
      message: {
        from: "RMHCSD - Ronald McDonald House Charities - San Diego <no-reply@blog.com>",
        to: emailUser,
      },
      locals: {
        ID: `${user[0]._id}`,
        FDATE: `${FDate}`,
        USERNAME: `${user[0].firstName} ${user[0].lastName}`,
      },
    })
    .then(() =>
      console.log(`email has been sent after consentform! ${emailUser}`)
    );
};
module.exports = emailAfterConsentForm;
