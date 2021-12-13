// Typ... REST api / end points. skulle kunna kalla det för "funktioner" också eller methods. Dvs, client application anropar dessa endpoints
// och vi ger tillbaka den datan som efterfrågas. Dessa funktioner exponeras sedan till backend servern
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

// importera modellen vi definerat i models/vehicle.js
// const vehicle = mongoose.model("Vehicle");
const { deserializeVehicleData } = require("./processMonthlyList");
const db = require("../models");
const Vehicle = db.vehicle;

const start = `TN14780JTEGG32M500015704  20045275008200420090127100000000SVART               2017010320181031201306281206
DT65690JMBXNCU2W3U011751  20035154003200320031023000000000ROD                 2013122020150831201106161023
KF69090JSAERD31S00302354  20055378005200420050518000000000SVART               2015082020171031201602040518
VV12160WVGZZZ5NZBW027272  20105692073201020100909000000000SVART               2016090120181031201009090909
JU43870SB1EZ56L00E054208  20075422031200620070322000000000ROD                 2015091420171031200806180322
SA28260WVWZZZ1KZ8W187856  20085653023200720080222000000000BLA                 2016102120181031200802220222
UF42650WDB2037301A947275  20075553006200620070625000000000GUL                 2015070320171031201509230625
CP92370WAUZZZ8P6BA093042  20105972133201020101216020161110ROD                 2016120920181031201012161216
PU33750VF33H9HZC84727110  20065183004200520060912000000000GRA                 2016081920181031200609120912
SV75430SB1KC56E80F011419  20075063018200720070810000000000BLA                 2015090920171031201404150810
TD71580YV1LW7206Y2682372  19995230023199919991210000000000GRA                 2016011420171031201507131210
XP57560VNKKV18330A415866  20055359022200420050405000000000GRA                 2015062620171031201506300405
PE84390WF0TXXTTPT8B01563  20080112002200620080404000000000VIT                 2016112520181130200902050404
YC24420SB1EW56L40E083915  20045138027200420071031100000000GRA                 2016091420181031200710311012
UJ92220WVGZZZ1TZ9W071873  20080045007200620081216000000000SVART               2016081220181031201511181216`;

// callback som vi passar till servern, som då blir en endpoint. Typ en JSON resposne from post/get till /listAllVehicles
function listAllVehicles(request, response) {
  console.log(`All vehicles requested`);
  let r = deserializeVehicleData(start);
  response.json(r);
}

function getVehicleInfo(request, response) {
  // TODO: parse id from request
  let r = deserializeVehicleData(start);
  response.json(r[0]);
}

function getAllVehicles(request, response) {
  let r = deserializeVehicleData(start);
  response.json(r);
}

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
  // changed: JSAERD31S00302354: 2015082020171031201602040518 -> 2017100120181031201602040518
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

router.get("/listVehicles", listAllVehicles);
router.get("/getInspectionList", getInspectionList);
router.post("/upload", uploadInspectionData);

module.exports = router;
