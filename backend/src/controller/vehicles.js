// Typ... REST api / end points. skulle kunna kalla det för "funktioner" också eller methods. Dvs, client application anropar dessa endpoints
// och vi ger tillbaka den datan som efterfrågas. Dessa funktioner exponeras sedan till backend servern
const express = require("express");
const router = express.Router();
let database;

function getInspectionList(request, response) {
  database.getAll().then((collection) => {
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
    const item = await database.findById(vehicle.identity);
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
      await database.update(vehicle).then((updateCount) => {
        if (updateCount != 0) updated++;
      });
    }
  }

  await database
    .insertMany(newvehicles)
    .then((insertCount) => {
      created += insertCount;
    })
    .catch((err) => {
      console.log(`Failed to create documents: ${err}`);
    });
  console.log(
    `Nya fordon: ${created} registrerade. Updaterade fordon: ${updated}`
  );
  response.json({
    message: `Besiktningsdata hanterad. Nya fordon: ${created}. Updaterade fordon: ${updated}`,
  });
}

router.get("/getInspectionList", getInspectionList);
router.post("/upload", uploadInspectionData);

function routerSetup(db) {
  database = db;
  return router;
}

module.exports = routerSetup;
