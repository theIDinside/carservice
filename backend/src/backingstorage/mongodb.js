const mongoose = require("mongoose");
// importera modellen vi definerat i models/vehicle.js

let db = require("../models");
const Vehicle = db.vehicle;

class DB {
  constructor() {}

  async findById(id) {
    return db.vehicle.findById(id);
  }

  async update(vehicle) {
    let updateCount = 0;
    let item = await this.findById(vehicle.identity);
    await item
      .updateOne({
        $set: {
          _id: vehicle.identity,
          chassiSerialNumber: vehicle.chassi,
          yearModel: vehicle.model,
          typeApproval: vehicle.approval,
          firstRegistration: vehicle.firstRegistration,
          privateImport: vehicle.privateImport,
          deregistrationDate: vehicle.deregistered,
          color: vehicle.color,
          prevInspection: vehicle.prevInspection,
          nextInspection: vehicle.nextInspection,
          previousRegistration: vehicle.prevRegistration,
          monthRegistration: vehicle.monthRegistration,
        },
      })
      .then((r) => {
        if (r.modifiedCount != 0) updateCount++;
      });
    return updateCount;
  }

  async insertMany(vehicles) {
    return db.vehicle.insertMany(vehicles).then((r) => r.length);
  }

  async getAll() {
    return db.vehicle.find({});
  }
}

module.exports = new DB();
