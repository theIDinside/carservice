// Typ... REST api / end points. skulle kunna kalla det för "funktioner" också eller methods. Dvs, client application anropar dessa endpoints
// och vi ger tillbaka den datan som efterfrågas. Dessa funktioner exponeras sedan till backend servern
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

// importera modellen vi definerat i models/vehicle.js
const db = require("../models");
const Vehicle = db.vehicle;

function getInspectionList(request, response) {
  db.vehicle.find({}).then((collection) => {
    const responseData = collection.map((vehicle) => {
      return {
        chassi: vehicle.chassiSerialNumber,
        prevInspection: vehicle.prevInspection,
        nextInspection: vehicle.nextInspection,
      };
    });
    response.json(responseData);
  });
}

async function uploadInspectionData(request, response) {
  if (!request.body.contents || request.body.contents.length == 0) {
    response.status(400).send({
      message: "Ny besiktningslista som försökte laddas upp var tom!",
    });
    return;
  }
  let newvehicles = [];
  let updated = 0;
  let created = 0;
  for (let vehicle of request.body.contents) {
    const item = await db.vehicle.findById(vehicle.identity);
    if (!item) {
      newvehicles.push({
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
      });
    } else {
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
          if (r.modifiedCount != 0) updated++;
        });
    }
  }

  await Vehicle.insertMany(newvehicles)
    .then((r) => {
      created += r.length;
    })
    .catch((err) => {
      console.log(`Failed to create documents: ${err}`);
    });

  response.json({
    message: `Besiktningsdata hanterad. Nya fordon: ${created}. Updaterade fordon: ${updated}`,
  });
}

router.get("/getInspectionList", getInspectionList);
router.post("/upload", uploadInspectionData);

module.exports = router;
