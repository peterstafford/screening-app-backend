const nodemailer = require("nodemailer");
const Email = require("email-templates");
let cron = require("node-cron");
var config = require("config");
// var Logo = require("../public/images/logo.png");
const { User } = require("../model/user");
const moment = require("moment");

const emailSend = function () {
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

  cron.schedule("00 00 * * *", async () => {
    let user = await User.find();
    let date = new Date();
    let FDate = moment(date, "hh").format("YYYY-MM-DD LT");
    user
      .filter((item) => item.recieveEmail == "Yes")
      .map((item) => {
        const email = new Email({
          transport: transporter,
          send: true,
          preview: false,
        });
        email
          .send({
            template: `defaultEmail`,
            message: {
              from: "RMHCSD - Ronald McDonald House Charities - San Diego <no-reply@blog.com>",
              to: `${item.email}`,
            },
            locals: {
              ID: `${item._id}`,
              FDATE: `${FDate}`,
              USERNAME: `${item.firstName} ${item.lastName}`,
            },
          })
          .then(() => console.log(`email has been sent! ${item.email}`));
        if (item.familyMembers[0].familyDetails != "") {
          item.familyMembers.map((familyMember) => {
            const email = new Email({
              transport: transporter,
              send: true,
              preview: false,
            });
            email
              .send({
                template: `defaultEmail`,
                message: {
                  from: "RMHCSD - Ronald McDonald House Charities - San Diego <no-reply@blog.com>",
                  to: `${item.email}`,
                },
                locals: {
                  ID: `${item._id}`,
                  FDATE: `${FDate}`,
                  FAMILYMEMBER: `${familyMember.familyDetails}`,
                },
              })
              .then(() =>
                console.log(
                  `email has been sent! ${familyMember.familyDetails}`
                )
              );
          });
        }
      });
  });
};
module.exports.emailSend = emailSend;
