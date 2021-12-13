const mongoose = require("mongoose");

const db = {
  mongoose: mongoose,
  vehicle: require("./vehicle"), // the Vehicle schema
};

module.exports = db;
