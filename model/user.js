const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    firstName: String,
    lastName: String,
    email: String,
    familyMembers: [
      {
        index: Number,
        familyDetails: String,
      },
    ],
    recieveEmail: {
      type: String,
      enum: ["Yes", "No", "Null"],
      default: "Null",
    },
  },
  { timestamps: true }
);
const User = mongoose.model("User", userSchema);
module.exports.User = User;
