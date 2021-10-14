var express = require("express");
const _ = require("lodash");
const { extend } = require("lodash");
var router = express.Router();
const { Question } = require("../../model/question");
const auth = require("../../middlewares/auth");

/* Get All Designations And Users */
router.get("/", auth, async (req, res) => {
  let page = Number(req.query.page ? req.query.page : 1);
  let perPage = Number(req.query.perPage ? req.query.perPage : 10);
  let skipRecords = perPage * (page - 1);
  let question = await Question.find().sort({
    createdAt: -1,
  });

  return res.send(question);
});

/*Add New Questions*/
router.post("/", auth, async (req, res) => {
  question = new Question(req.body);
  question
    .save()
    .then((resp) => {
      return res.send(resp);
    })
    .catch((err) => {
      return res.status(500).send({ error: err });
    });
});

// Update Questions
router.put("/:id", auth, async (req, res) => {
  try {
    let question = await Question.findById(req.params.id);
    console.log(question);
    if (!question)
      return res.status(400).send("Question with given id is not present");
    question = extend(question, req.body);
    await question.save();
    return res.send(question);
  } catch {
    return res.status(400).send("Invalid Question Id"); // when id is inavlid
  }
});

// Delete Questions
router.delete("/:id", auth, async (req, res) => {
  try {
    let question = await Question.findByIdAndDelete(req.params.id);
    if (!question) {
      return res.status(400).send("Question with given id is not present"); // when there is no id in db
    }
    return res.send(question); // when everything is okay
  } catch {
    return res.status(400).send("Invalid Question Id"); // when id is inavlid
  }
});

module.exports = router;
