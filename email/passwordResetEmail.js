const nodemailer = require("nodemailer");
const Email = require("email-templates");

var config = require("config");
const { Admin } = require("../model/admin");
const moment = require("moment");

const passwordResetEmail = async (userEmail, subject, text) => {
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
      template: `passwordResetTemplate`,
      message: {
        from: "RMHCSD - Ronald McDonald House Charities - San Diego <no-reply@blog.com>",
        to: `${userEmail}`,
      },
      locals: {
        link: `${text}`,
        subject: `${subject}`,
      },
    })
    .then(() => console.log("email has been sent! posword reset"));
};
module.exports = passwordResetEmail;
