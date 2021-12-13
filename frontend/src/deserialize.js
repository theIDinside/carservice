const vehicleProperties = [
  { identity: 7 },
  { chassi: 19 },
  { model: 4 },
  { approval: 11 },
  { firstRegistration: 8 },
  { privateImport: 1 },
  { deregistered: 8 },
  { color: 20 },
  { prevInspection: 8 },
  { nextInspection: 8 },
  { prevRegistration: 8 },
  { monthRegistration: 4 },
];

const propertyIsNumber = [
  false,
  false,
  true,
  true,
  true,
  true,
  true,
  false,
  true,
  true,
  true,
  true,
];

function vehicle(
  id,
  chassi,
  model,
  approval,
  firstRegistration,
  privateImport,
  deregistered,
  color,
  prevInspection,
  nextInspection,
  prevRegistration,
  monthRegistration
) {
  return {
    identity: id,
    chassi: chassi,
    model: model,
    approval: approval,
    firstRegistration: firstRegistration,
    privateImport: privateImport == 1,
    deregistered: deregistered,
    color: color,
    prevInspection: prevInspection,
    nextInspection: nextInspection,
    prevRegistration: prevRegistration,
    monthRegistration: monthRegistration,
  };
}

/**
 * Processes a raw inspection entry line
 * @param {string} line
 */
function tokenize_line(line) {
  let res = {
    result: {},
    isOk: true,
  };
  let propertyIndex = 0;
  let columnIndex = 0;
  let parts = [];
  for (let info of vehicleProperties) {
    for (let vehicleProperty in info) {
      let part = line.substring(
        columnIndex,
        columnIndex + info[vehicleProperty]
      );
      if (propertyIsNumber[propertyIndex++]) {
        try {
          let r = Number.parseInt(part);
          if (Number.isNaN(r)) {
            throw new Error();
          }
          parts.push(r);
        } catch (e) {
          res.isOk = false;
        }
      } else {
        parts.push(part.trim());
      }
      columnIndex += info[vehicleProperty];
    }
  }
  res.result = parts;
  return res;
}

/**
 * Returns a list of items, processed from the input that the user uploads
 * to the server (i.e; the monthly vehicle inspection data, in the quirky file format)
 * @param {string} data - the contents of the file that the user uploads
 * @returns { { error: string[], result: [] } }
 */
function tokenizeInput(data) {
  let vehicles = {
    error: [],
    result: [],
  };
  let lines = data.split("\n");
  for (const line of lines) {
    let processedLine = tokenize_line(line);
    if (processedLine.isOk) {
      vehicles.result.push(processedLine.result);
    }
  }
  return vehicles;
}

function deserializeVehicleData(data) {
  let res = [];
  let tokenized = tokenizeInput(data);
  for (let vehicleTokens of tokenized.result) {
    const [id, chassi, ym, ta, fr, pi, drd, c, li, ni, pr, mr] = vehicleTokens;
    const v = vehicle(id, chassi, ym, ta, fr, pi, drd, c, li, ni, pr, mr);
    res.push(v);
  }

  return {
    res: res,
    errors: tokenized.error,
  };
}

module.exports = {
  deserializeVehicleData,
};
