const { Router } = require("express");
const loadTemperaments = require("../controllers/loadTemperaments");
const loadDogs = require("../controllers/loadDogs");
const getAllDogs = require("../controllers/getAllDogs");
const router = Router();

router.get("/loadTemperaments", loadTemperaments);

router.get("/loadDogs", loadDogs);

router.get("/all", getAllDogs);

module.exports = router;
