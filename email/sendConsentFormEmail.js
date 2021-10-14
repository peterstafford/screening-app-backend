const nodemailer = require("nodemailer");
const Email = require("email-templates");
var config = require("config");
const { Admin } = require("../model/admin");
const moment = require("moment");

const sendConsentFormEmail = async (userEmail, subject, text) => {
  let date = new Date();
  let FDate = moment(date, "hh").format("MM-DD-YYYY LT");
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

  email
    .send({
      template: `consentFormTemplate`,
      message: {
        from: "RMHCSD - Ronald McDonald House Charities - San Diego <no-reply@blog.com>",
        to: `${userEmail}`,
      },
      locals: {
        FDATE: `${FDate}`,
        TEXT: `${text}`,
      },
    })
    .then(() => console.log("email has been sent! consent form"));
};
module.exports = sendConsentFormEmail;
