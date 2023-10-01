const { Temperament } = require("../db");
const axios = require("axios");

const { API_KEY } = process.env;
const URL = `https://api.thedogapi.com/v1/breeds?api_key=${API_KEY}`;

const loadTemperaments = async (req, res) => {
  try {
    // Obtener datos de la API
    const response = await axios.get(URL);
    const dogData = response.data;

    // Crear temperamentos únicos
    const uniqueTemperaments = new Set();
    dogData.forEach((dog) => {
      const temperaments = dog.temperament ? dog.temperament.split(", ") : [];
      temperaments.forEach((temperament) =>
        uniqueTemperaments.add(temperament)
      );
    });

    // Mantener un registro de si se realizó alguna actualización
    let updated = false;

    // Crear registros de temperamentos en la base de datos
    await Promise.all(
      Array.from(uniqueTemperaments).map(async (temperament) => {
        try {
          // Verificar si el temperamento ya existe en la base de datos
          const [existingTemperament, created] = await Temperament.findOrCreate(
            {
              where: { name: temperament },
            }
          );
          if (created) {
            console.log(`Nuevo temperamento creado: ${temperament}`);
            updated = true;
          } else {
            console.log(`El temperamento ya existe: ${temperament}`);
          }
        } catch (error) {
          console.error("Error al crear el temperamento:", error);
        }
      })
    );

    if (!updated) {
      // Si no se realizó ninguna actualización, enviar una respuesta adecuada
      return res.status(200).json({ message: "No changes to add." });
    }

    // Enviar respuesta de éxito
    res.status(200).json({ message: "Data loaded successfully." });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error loading data.", error: error.message });
  }
};

module.exports = loadTemperaments;
