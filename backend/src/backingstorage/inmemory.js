class DB {
  #db = new Map();

  constructor() {}

  async findById(id) {
    return this.#db.get(id);
  }

  async update(vehicle) {
    let item = this.#db.get(vehicle.identity);
    if (item) {
      let identical =
        item._id == vehicle.identity &&
        item.chassiSerialNumber == vehicle.chassi &&
        item.yearModel == vehicle.model &&
        item.typeApproval == vehicle.approval &&
        item.firstRegistration == vehicle.firstRegistration &&
        item.privateImport == vehicle.privateImport &&
        item.deregistrationDate == vehicle.deregistered &&
        item.color == vehicle.color &&
        item.prevInspection == vehicle.prevInspection &&
        item.nextInspection == vehicle.nextInspection &&
        item.previousRegistration == vehicle.prevRegistration &&
        item.monthRegistration == vehicle.monthRegistration;
      if (!identical) {
        this.#db.set(vehicle.identity, {
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
        return 1;
      }
    }
    return 0;
  }

  async insertMany(vehicles) {
    let created = 0;
    for (const v of vehicles) {
      this.#db.set(v._id, v);
      created++;
    }
    return created;
  }

  async getAll() {
    let result = [];
    this.#db.forEach((v) => result.push(v));
    return result;
  }
}

module.exports = new DB();
