const mongoose = require("mongoose");

const questionsSpanishSchema = mongoose.Schema(
  {
    QuestionOne: String,
    QuestionTwo: String,
    QuestionThree: String,
    QuestionFour: String,
    userName: String,
  },
  { timestamps: true }
);

const QuestionSpanish = mongoose.model(
  "QuestionSpanish",
  questionsSpanishSchema
);
module.exports.QuestionSpanish = QuestionSpanish;
