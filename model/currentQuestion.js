const mongoose = require("mongoose");

const currentQuestionsSchema = mongoose.Schema(
  {
    QuestionOne: String,
    QuestionTwo: String,
    QuestionThree: String,
    QuestionFour: String,
    userName: String,
  },
  { timestamps: true }
);

const currentQuestion = mongoose.model(
  "currentQuestion",
  currentQuestionsSchema
);
module.exports.currentQuestion = currentQuestion;
