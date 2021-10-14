const mongoose = require("mongoose");

const currentQuestionSpanishSchema = mongoose.Schema(
  {
    QuestionOne: String,
    QuestionTwo: String,
    QuestionThree: String,
    QuestionFour: String,
    userName: String,
  },
  { timestamps: true }
);

const currentQuestionSpanish = mongoose.model(
  "currentQuestionSpanish",
  currentQuestionSpanishSchema
);
module.exports.currentQuestionSpanish = currentQuestionSpanish;
