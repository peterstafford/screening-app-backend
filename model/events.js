const mongoose = require("mongoose");

const eventsSchema = mongoose.Schema(
  {
    title: String,
    description: String,
    image:String,
    startingDate: Date,
    endingDate: Date,
  },
  { timestamps: true }
);

const Events = mongoose.model("Events", eventsSchema);
module.exports.Events = Events;
