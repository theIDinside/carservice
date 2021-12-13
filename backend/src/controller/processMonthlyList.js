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
    errors: [],
    result: {},
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
      if (part.length != info[vehicleProperty]) {
        res.errors.push(
          `Error on input for ${vehicleProperty}: '${part}' (${part.length} != ${info[vehicleProperty]})`
        );
      } else {
        if (propertyIsNumber[propertyIndex++]) {
          try {
            let r = Number.parseInt(part);
            if (Number.isNaN(r)) {
              throw new Error();
            }
            parts.push(r);
          } catch (e) {
            res.error.push(
              `\t[ERROR]: Could not read a number for vehicle property ${vehicleProperty}: ${part}`
            );
          }
        } else {
          parts.push(part.trim());
        }
      }
      columnIndex += info[vehicleProperty];
    }
  }

  if (res.errors.length == 0 && parts.length == vehicleProperties.length) {
    let partIndex = 0;
    for (let i of vehicleProperties) {
      for (let property in i) {
        res.result[property] = parts[partIndex++];
      }
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
  let lineNumber = 0;
  for (const line of lines) {
    lineNumber++;
    let processedLine = tokenize_line(line);
    if (processedLine.errors.length != 0) {
      let errMsg = `Failed to process vehicle on line ${lineNumber}:\n${processedLine.errors.join(
        "\n"
      )}`;
      vehicles.error.push(errMsg);
    } else {
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
  return res;
}

module.exports = {
  processInput: tokenizeInput,
  process_line: tokenize_line,
  deserializeVehicleData,
};
