var express = require("express");
var router = express.Router();
const { extend } = require("lodash");
const { Events } = require("../../model/events");
const bcrypt = require("bcryptjs");
const _ = require("lodash");
const jwt = require("jsonwebtoken");
const config = require("config");
const auth = require("../../middlewares/auth");
const admin = require("../../middlewares/admin");
const cloudinary = require("../utils/cloudinary");
const upload = require("../utils/multer");

/* GET All Events */
router.get("/", async function (req, res, next) {
  let page = Number(req.query.page ? req.query.page : 1);
  let perPage = Number(req.query.perPage ? req.query.perPage : 100);
  let skipRecords = perPage * (page - 1);
  let events = await Events.find().sort({
    createdAt: -1,
  });

  return res.send(events);
});

router.get("/upcoming-week", async function (req, res, next) {
  var date = new Date();
  date.setDate(date.getDate() + 7);

  let page = Number(req.query.page ? req.query.page : 1);
  let perPage = Number(req.query.perPage ? req.query.perPage : 100);
  let skipRecords = perPage * (page - 1);
  console.log(new Date());
  let events = await Events.find({
    startingDate: { $gte: new Date(), $lte: date },
  }).sort({
    createdAt: -1,
  });

  return res.send(events);
});

router.get("/past-week", async function (req, res, next) {
  var date = new Date();
  date.setDate(date.getDate() - 7);

  let page = Number(req.query.page ? req.query.page : 1);
  let perPage = Number(req.query.perPage ? req.query.perPage : 100);
  let skipRecords = perPage * (page - 1);
  console.log(new Date());
  let events = await Events.find({
    startingDate: { $gte: date, $lte: new Date() },
  }).sort({
    createdAt: -1,
  });

  return res.send(events);
});

router.get("/upcoming-month", async function (req, res, next) {
  var date = new Date();
  date.setDate(date.getDate() + 30);

  let page = Number(req.query.page ? req.query.page : 1);
  let perPage = Number(req.query.perPage ? req.query.perPage : 100);
  let skipRecords = perPage * (page - 1);
  console.log(new Date());
  let events = await Events.find({
    startingDate: { $gte: new Date(), $lte: date },
  }).sort({
    createdAt: -1,
  });

  return res.send(events);
});

router.get("/single-event/:id", async function (req, res, next) {
  let page = Number(req.query.page ? req.query.page : 1);
  let perPage = Number(req.query.perPage ? req.query.perPage : 100);
  let skipRecords = perPage * (page - 1);
  console.log(new Date());
  let events = await Events.findById(req.params.id).sort({
    createdAt: -1,
  });

  return res.send(events);
});

/* Add Event . */
router.post("/", auth, upload.single("image"), async (req, res) => {
  if (req.fileValidationError) {
    return res
      .status(400)
      .send("Invalid File Format! Make sure file is a JPG , JPEG or PNG");
  }else{
  let events = await Events.findOne({ title: req.body.title });
  if (events)
    return res.status(400).send("Event With Same Title Already Exsists");
  if (!req.body.image) {
    const result = await cloudinary.uploader.upload(req.file.path);
    events = new Events({
      title: req.body.title,
      description: req.body.description,
      image: result.secure_url,
      startingDate: req.body.startingDate,
      endingDate: req.body.endingDate,
    });
  } else {
    events = new Events({
      title: req.body.title,
      description: req.body.description,
      startingDate: req.body.startingDate,
      endingDate: req.body.endingDate,
    });
  }
  events
    .save()
    .then((resp) => {
      return res.send(resp);
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).send({ error: err });
    });
  }
});


// Update Events
router.put("/:id", auth, upload.single("image"), async (req, res) => {
  try {
    if (req.fileValidationError) {
      return res
        .status(400)
        .send("Invalid File Format! Make sure file is a JPG , JPEG or PNG");
    } else {
      let events = await Events.findById(req.params.id);
      if (!events)
        return res.status(400).send("Events with given id is not present");
      if (!req.body.image) {
        const result = await cloudinary.uploader.upload(req.file.path);
        events = extend(events, {
          title: req.body.title,
          description: req.body.description,
          image: result.secure_url,
          startingDate: req.body.startingDate,
          endingDate: req.body.endingDate,
        });
      } else {
        events = extend(events, {
          title: req.body.title,
          description: req.body.description,
          startingDate: req.body.startingDate,
          endingDate: req.body.endingDate,
        });
      }
      await events.save();
      return res.send(events);
    }
  } catch (error) {
    console.log("ERRROr", error);
    return res.status(400).send("Invalid ID"); // when id is inavlid
  }
});

// Delete Events
router.delete("/:id", auth, async (req, res) => {
  try {
    let events = await Events.findByIdAndDelete(req.params.id);
    if (!events) {
      return res.status(400).send("events with given id is not present"); // when there is no id in db
    }
    return res.send(events); // when everything is okay
  } catch {
    return res.status(400).send("Invalid Id"); // when id is inavlid
  }
});

module.exports = router;
