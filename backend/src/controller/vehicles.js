// Typ... REST api / end points. skulle kunna kalla det för "funktioner" också eller methods. Dvs, client application anropar dessa endpoints
// och vi ger tillbaka den datan som efterfrågas. Dessa funktioner exponeras sedan till backend servern
const express = require("express");
const router = express.Router();

// importera modellen vi definerat i models/vehicle.js
const db = require("../models");
const Vehicle = db.vehicle;

function getInspectionList(request, response) {
  let r = [];
  db.forEach((vehicle) => {
    r.push({
      chassi: vehicle.chassiSerialNumber,
      prevInspection: vehicle.prevInspection,
      nextInspection: vehicle.nextInspection,
    });
  });
  response.json(r);
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
  let isIdentical = false;
  for (let vehicle of request.body.contents) {
    if (db.has(vehicle.identity)) {
      const entry = db.get(vehicle.identity);
      isIdentical =
        entry._id == vehicle.identity &&
        entry.chassiSerialNumber == vehicle.chassi &&
        entry.yearModel == vehicle.model &&
        entry.typeApproval == vehicle.approval &&
        entry.firstRegistration == vehicle.firstRegistration &&
        entry.privateImport == vehicle.privateImport &&
        entry.deregistrationDate == vehicle.deregistered &&
        entry.color == vehicle.color &&
        entry.prevInspection == vehicle.prevInspection &&
        entry.nextInspection == vehicle.nextInspection &&
        entry.previousRegistration == vehicle.prevRegistration &&
        entry.monthRegistration == vehicle.monthRegistration;
      if (!isIdentical) {
        updated++;
      }
    } else {
      created++;
    }
    if (!isIdentical) {
      db.set(vehicle.identity, {
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
    }
    isIdentical = false;
  }

  response.json({
    message: `Besiktningsdata hanterad. Nya fordon: ${created}. Updaterade fordon: ${updated}`,
  });
}

router.get("/getInspectionList", getInspectionList);
router.post("/upload", uploadInspectionData);

module.exports = router;
