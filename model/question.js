const mongoose = require("mongoose");

const questionsSchema = mongoose.Schema(
  {
    QuestionOne: String,
    QuestionTwo: String,
    QuestionThree: String,
    QuestionFour: String,
    userName: String,
  },
  { timestamps: true }
);

const Question = mongoose.model("Question", questionsSchema);
module.exports.Question = Question;
