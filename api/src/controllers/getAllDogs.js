const { Dog, Temperament } = require("../db");

const getAllDogs = async (req, res) => {
  try {
    // Consulta a la base de datos para obtener todos los perros con sus temperamentos
    const dogs = await Dog.findAll({
      include: [
        {
          model: Temperament,
          attributes: ["name"],
          through: {
            attributes: [], // Esto evita que se incluyan campos adicionales en la respuesta
          },
        },
      ],
      order: [["id", "ASC"]],
    });

    // Formatea los datos según lo desees
    const formattedDogs = dogs.map((dog) => ({
      id: dog.id,
      name: dog.name,
      image: dog.image,
      height: dog.height,
      weight: dog.weight,
      life_span: dog.life_span,
      temperaments: dog.temperaments.length
        ? dog.temperaments.map((temperament) => temperament.name)
        : ["It doesn't have any temperament added"],
    }));

    // Envía la respuesta en formato JSON
    res.status(200).json(formattedDogs);
  } catch (error) {
    console.error("Error al obtener perros con temperamentos:", error);
    // Envía una respuesta de error si ocurre un problema
    res.status(500).json({ message: "Error fetching dogs with temperaments." });
  }
};

module.exports = getAllDogs;
