var express = require("express");
var router = express.Router();
const { extend } = require("lodash");
const { Admin } = require("../../model/admin");
const bcrypt = require("bcryptjs");
const _ = require("lodash");
const jwt = require("jsonwebtoken");
const config = require("config");
const auth = require("../../middlewares/auth");
const admin = require("../../middlewares/admin");

/* GET Admin */
router.get("/", auth, async function (req, res, next) {
  let page = Number(req.query.page ? req.query.page : 1);
  let perPage = Number(req.query.perPage ? req.query.perPage : 100);
  let skipRecords = perPage * (page - 1);
  let admin = await Admin.find({ userRole: "Admin" }).sort({
    createdAt: -1,
  });

  return res.send(admin);
});

/* Signup . */
router.post("/", auth, async (req, res) => {
  let admin = await Admin.findOne({ email: req.body.email });
  if (admin)
    return res.status(400).send("Admin With Given Email Already Exsists");
  admin = new Admin();
  admin.firstName = req.body.firstName;
  admin.lastName = req.body.lastName;
  admin.email = req.body.email;
  admin.password = req.body.password;
  await admin.generateHashedPassword();
  await admin.save();
  return res.send(_.pick(admin, ["firstName", "lastName", "email"]));
});

// Update admin
router.put("/update-admin/:id", auth, async (req, res) => {
  try {
    let admin = await Admin.findById(req.params.id);
    console.log(admin);
    if (!admin)
      return res.status(400).send("Admin with given id is not present");
    console.log("request Nody", req.body.password);
    console.log("Admin password", admin.password);

    if (req.body.password !== admin.password) {
      console.log("request Body shgahshahs", req.body.password);
      console.log("Admin password", admin.password);
      admin = extend(admin, req.body);
      await admin.generateHashedPassword();
      await admin.save();
    } else {
      admin = extend(admin, req.body);
      await admin.save();
    }

    return res.send(admin);
  } catch (error) {
    console.log(error);
    return res.status(400).send("Invalid ID"); // when id is inavlid
  }
});

// Sign In
router.post("/login", async (req, res) => {
  console.log(req.body);
  let admin = await Admin.findOne({ email: req.body.email });
  if (!admin) return res.status(400).send("Admin Not Registered");
  let isValid = await bcrypt.compare(req.body.password, admin.password);
  if (!isValid) return res.status(401).send("Invalid Password");
  let token = jwt.sign(
    {
      _id: admin._id,
      firstName: admin.firstName,
      lastName: admin.lastName,
      email: admin.email,
      userRole: admin.userRole,
    },
    config.get("jwtPrivateKey")
  );
  return res.send(token);
});

router.put("/update-password/:id", auth, async (req, res) => {
  let admin = await Admin.findById(req.params.id);
  if (!admin) {
    return res.status(400).send("Admin with given id is not present"); // when there is no id in db
  }
  let isValid = await bcrypt.compare(req.body.oldPassword, admin.password);
  if (isValid) {
    admin.password = req.body.password;
    await admin.generateHashedPassword();
    await admin.save();
    return res.send("Password Changed Successfully");
  }
  return res.send("Invalid Old Password");
});

router.put("/:id", auth, async (req, res) => {
  try {
    let duplicateUser = await Admin.findOne({ email: req.body.email });
    if (duplicateUser) {
      return res
        .status(400)
        .send("Admin with Email Address Exsist Enter A Diifernt Email Addres"); // when there is no id in db
    } else {
      let admin = await Admin.findById(req.params.id);
      console.log(admin);
      if (!admin)
        return res.status(400).send("admin with given id is not present");
      console.log("request Nody", req.body.password);
      console.log("admin password", admin.password);

      if (req.body.password !== admin.password) {
        console.log("request Body shgahshahs", req.body.password);
        console.log("admin password", admin.password);
        admin = extend(admin, req.body);
        await admin.generateHashedPassword();
        await admin.save();
      } else {
        admin = extend(admin, req.body);
        await admin.save();
      }

      return res.send(admin);
    }
  } catch (error) {
    console.log(error);
    return res.status(400).send("Invalid Id"); // when id is inavlid
  }
});

// Delete admin
router.delete("/:id", auth, async (req, res) => {
  try {
    let admin = await Admin.findByIdAndDelete(req.params.id);
    if (!admin) {
      return res.status(400).send("admin with given id is not present"); // when there is no id in db
    }
    return res.send(admin); // when everything is okay
  } catch {
    return res.status(400).send("Invalid Id"); // when id is inavlid
  }
});

module.exports = router;
