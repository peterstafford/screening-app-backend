var express = require("express");
var router = express.Router();
const { extend } = require("lodash");
const { User } = require("../../model/user");
const sendConsentFormEmail = require("../../email/sendConsentFormEmail");

sendConsentFormEmail;
const auth = require("../../middlewares/auth");
const admin = require("../../middlewares/admin");

const Mongoose = require("mongoose");

/* GET  All Users */
router.get("/", auth, async function (req, res, next) {
  let page = Number(req.query.page ? req.query.page : 1);
  let perPage = Number(req.query.perPage ? req.query.perPage : 100);
  let skipRecords = perPage * (page - 1);
  let user = await User.find().sort({
    createdAt: -1,
  });

  return res.send(user);
});
router.get("/single-user/:id", auth, async function (req, res, next) {
  let page = Number(req.query.page ? req.query.page : 1);
  let perPage = Number(req.query.perPage ? req.query.perPage : 100);
  let skipRecords = perPage * (page - 1);
  let user = await User.findById(req.params.id);

  return res.send(user);
});

/* Add New User . */
router.post("/", async (req, res) => {
  if (req.body.userId === null || !req.body.userId) {
    console.log("body", req.body);
    let user = await User.findOne({
      email: req.body.email,
    });
    if (user)
      return res.status(400).send("User With Given Email Already Exists");
    user = new User(req.body);
    await user
      .save()
      .then((resp) => {
        let link = `https://rmhcsdwellness.safebusinesssolutions.com/consentform/${resp._id}/${req.body.firstName}/${req.body.lastName}/${req.body.email}`;
        sendConsentFormEmail(req.body.email, "Fill Out Consent Form", link);
        return res.send(user);
      })
      .catch((err) => {
        return res.status(500).send({ error: err });
      });
  } else {
    try {
      let user = await User.findById(req.body.userId);
      console.log(user);
      if (!user)
        return res.status(400).send("User with given id is not present");
      user = extend(user, req.body);
      await user.save();
      return res.send(user);
    } catch {
      return res.status(400).send("Invalid Id"); // when id is inavlid
    }
  }
});

/* Update User . */
router.get("/:id", async (req, res) => {
  try {
    let user = await User.findById(req.params.id);
    console.log(user);
    if (!user) return res.status(400).send("User with given id is not present");
    user.recieveEmail = "No";
    await user.save();
    return res.redirect(
      "https://rmhcsdwellness.safebusinesssolutions.com/opt-out"
    );
  } catch {
    return res.status(400).send("Invalid Id"); // when id is inavlid
  }
});

router.put("/:id", auth, async (req, res) => {
  try {
    let user = await User.findById(req.params.id);
    console.log(user);
    if (!user) return res.status(400).send("User with given id is not present");
    user = extend(user, req.body);
    await user.save();
    return res.send(user);
  } catch {
    return res.status(400).send("User Question Id"); // when id is inavlid
  }
});

/* Delete User . */
router.delete("/:id", auth, async (req, res) => {
  try {
    let user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(400).send("User with given id is not present"); // when there is no id in db
    }
    return res.send(user); // when everything is okay
  } catch {
    return res.status(400).send("Invalid Id"); // when id is inavlid
  }
});

module.exports = router;
