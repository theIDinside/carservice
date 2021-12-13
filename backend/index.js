const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const vehicles = require("./src/controller/vehicles");
const app = express();
app.use(bodyParser.json());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
var corsOptions = {
  origin: "http://localhost:8080",
};
// use cors options
app.use(cors(corsOptions));
const db = require("./src/models/index");
const PORT = process.env.PORT || 8000;

db.mongoose
  .connect(process.env.MDBURI || "mongodb://localhost:27017/carservice", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 3000, // om vi inte lyckas ansluta inom 3 sek, kör fallback case med inmemory database
  })
  .then(() => {
    console.log("Ansluten till MongoDB: OK!");
    // vi injicerar en klass som wrappar en MongoDB anslutning och använder det som persistent storage
    let DB = require("./src/backingstorage/mongodb");
    app.use("/api/vehicles", vehicles(DB));
    // listening port

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}.`);
    });
  })
  .catch((err) => {
    console.log(
      `Anslutningen till MongoDB misslyckades. Kör fallback med InMemory database (hashmap)`
    );
    // här injicerar vi istället en egen skriven "in memory database" eftersom anslutningen mot en MongoDB-server misslyckades
    let DB = require("./src/backingstorage/inmemory");
    app.use("/api/vehicles", vehicles(DB));
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}.`);
    });
  });
