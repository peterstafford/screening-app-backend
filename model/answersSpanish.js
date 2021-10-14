const mongoose = require("mongoose");

const answerSpanishSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    familyMember: {
      type: String,
    },
    questionSpanish: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "QuestionSpanish",
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

const AnswerSpanish = mongoose.model("AnswerSpanish", answerSpanishSchema);
module.exports.AnswerSpanish = AnswerSpanish;
