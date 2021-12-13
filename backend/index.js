const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const vehicles = require("./src/controller/vehicles");
const app = express();
const db = require("./src/models/index");

db.mongoose
  .connect(process.env.MDBURI || "mongodb://localhost:27017/carservice", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Ansluten till MongoDB: OK!");
    // parse application/json
    app.use(bodyParser.json());

    // parse application/x-www-form-urlencoded
    app.use(bodyParser.urlencoded({ extended: true }));

    var corsOptions = {
      origin: "http://localhost:8080",
    };
    // use cors options
    app.use(cors(corsOptions));

    app.use("/api/vehicles", vehicles);
    // listening port
    const PORT = process.env.PORT || 8000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}.`);
    });
  })
  .catch((err) => {
    console.log(`Anslutningen till MongoDB misslyckades: ${err}`);
    process.exit();
  });
