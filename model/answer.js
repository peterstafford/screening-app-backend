const mongoose = require("mongoose");

const answerSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    familyMember: {
      type: String,
    },
    question: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
    },
    AnswerOne: String,
    AnswerTwo: String,
    AnswerThree: String,
    AnswerFour: String,
    // Name: String,
    LastName: String,
    Phone: String,
    PersonComp: String,
    Purpose: String,
  },

  { timestamps: true }
);

const Answer = mongoose.model("Answer", answerSchema);
module.exports.Answer = Answer;
