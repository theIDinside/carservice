const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// the schema for which we will manage the data provided by the user/client
// in the quirky format they use.
const VehicleSchema = new Schema({
  _id: String, // MongoDB använder det här som en primary key. Vi vill kunna bestämma exakt vilket id ett objekt har, annars tilldelar MongoDB ett eget _id värde.
  chassiSerialNumber: String,
  yearModel: Number,
  typeApproval: Number,
  firstRegistration: Number,
  privateImport: Boolean,
  deregistrationDate: Number,
  color: String,
  prevInspection: Number,
  nextInspection: Number,
  previousRegistration: Number,
  monthRegistration: Number,
});

// här registrerar vi våran "modell" av datan med MongoDB, genom ett litet utility-paket (mongoose)
module.exports = mongoose.model("Vehicle", VehicleSchema);
