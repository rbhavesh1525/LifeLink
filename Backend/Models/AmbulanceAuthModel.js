const mongoose = require("mongoose");

const ambulanceSchema = new mongoose.Schema({
  driverName: { type: String, required: true },
  driverEmail: { type: String, required: true, unique: true },  // ✅ Added driverEmail
  driverAddress: { type: String, required: true },
  driverLicense: { type: String, required: true, unique: true },
  driverExperience: { type: Number, required: true },
  ambulanceNumber: { type: String, required: true, unique: true },
  ambulanceType: { type: String, required: true },
  vehicleName: { type: String, required: true },
  contactNumber: { type: String, required: true },
  operatingArea: { type: String, required: true },
  driverPassword: { type: String, required: true },
});

const Ambulance = mongoose.model("Ambulance", ambulanceSchema);
module.exports = Ambulance;
