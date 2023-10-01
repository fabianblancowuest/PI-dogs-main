const { Dog, Temperament } = require("../db");
const axios = require("axios");

const { API_KEY } = process.env;
const URL = `https://api.thedogapi.com/v1/breeds?api_key=${API_KEY}`;

const loadDogs = async (req, res) => {
  try {
    // Obtener datos de la API
    const response = await axios.get(URL, { timeout: 60000 });
    const dogData = response.data;
    console.log(dogData.length);

    // Comprobar si ya existe un perro con el mismo nombre en la base de datos
    const existingDogNames = await Dog.findAll({ attributes: ["name"] });
    const existingDogNamesSet = new Set(
      existingDogNames.map((dog) => dog.name)
    );

    // Mantener un registro de si se realizó alguna actualización
    let updated = false;

    // Crear registros de perros en la base de datos
    await Promise.all(
      dogData.map(async (dog) => {
        if (!existingDogNamesSet.has(dog.name)) {
          const newDog = {
            image: dog.image.url,
            name: dog.name,
            height: dog.height.metric,
            weight: dog.weight.metric,
            life_span: dog.life_span,
          };
          const temperaments = dog.temperament
            ? dog.temperament.split(", ")
            : [];

          // Buscar los IDs de los temperamentos asociados a este perro
          const temperamentIds = await Temperament.findAll({
            where: { name: temperaments },
            attributes: ["id"],
          });

          // Crear el perro y relacionarlo con los temperamentos
          const createdDog = await Dog.create(newDog);
          await createdDog.setTemperaments(temperamentIds);

          // Marcar como actualizado
          updated = true;
        }
      })
    );

    if (!updated) {
      // Si no se realizó ninguna actualización, enviar una respuesta adecuada
      return res.status(200).json({ message: "No changes to add." });
    }

    res.status(200).json({ message: "Data loaded successfully." });
  } catch (error) {
    res.status(500).json({ message: "Error loading data.", error: error });
  }
};

module.exports = loadDogs;
