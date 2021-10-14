var express = require("express");
const _ = require("lodash");
const { extend } = require("lodash");
var router = express.Router();
const {
  currentQuestionSpanish,
} = require("../../model/currentQuestionSpanish");
const { QuestionSpanish } = require("../../model/questionSpanish");
const questionareChangedEmail = require("../../email/questionareChangedEmail");

const auth = require("../../middlewares/auth");

/* Get All Current Question  */
router.get("/", async (req, res) => {
  let page = Number(req.query.page ? req.query.page : 1);
  let perPage = Number(req.query.perPage ? req.query.perPage : 10);
  let skipRecords = perPage * (page - 1);
  let question = await currentQuestionSpanish.find().sort({
    createdAt: -1,
  });

  return res.send(question);
});

/*Add New Current Questions*/
router.post("/", auth, async (req, res) => {
  let question = await currentQuestionSpanish.find();
  let question1 = new QuestionSpanish(req.body);

  console.log("Question", question);
  if (question.length === 1) {
    question = extend(question[0], req.body);
    questionareChangedEmail(
      "Questionare Changed",
      `
    username : ${req.body.userName}<br>
    click on below link to view changed questions<br>
    https://rmhcsdwellness.safebusinesssolutions.com/question-spanish
    `
    );
    await question.save();
    await question1
      .save()
      .then((resp) => {
        return res.send(resp);
      })
      .catch((err) => {
        return res.status(500).send({ error: err });
      });
  } else {
    question = new currentQuestionSpanish(req.body);
    await question.save();
    await question1
      .save()
      .then((resp) => {
        return res.send(resp);
      })
      .catch((err) => {
        return res.status(500).send({ error: err });
      });
  }
});

// Update Current Questions
router.put("/:id", auth, async (req, res) => {
  try {
    let question = await currentQuestionSpanish.findById(req.params.id);
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

// Delete  Current Questions
router.delete("/:id", auth, async (req, res) => {
  try {
    let question = await currentQuestionSpanish.findByIdAndDelete(
      req.params.id
    );
    if (!question) {
      return res.status(400).send("Question with given id is not present"); // when there is no id in db
    }
    return res.send(question); // when everything is okay
  } catch {
    return res.status(400).send("Invalid Question Id"); // when id is inavlid
  }
});

module.exports = router;
