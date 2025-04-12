const mongoose = require("mongoose");

const userLocationSchema = new mongoose.Schema({

  userId :String,
  location: {
    latitude: Number,
    longitude: Number,
  },
});

module.exports = mongoose.model("User-location", userLocationSchema);
