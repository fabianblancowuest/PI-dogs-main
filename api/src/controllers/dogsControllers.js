const { Dog } = require("../db");

const getDogs = async (req, res) => {
	try {
		const { id } = req.params;
		const dogs = await Dog.findAll({
			where: { id },
		});
		return res.json(dogs);
	} catch (error) {
		return res.status(500).send(error.message);
	}
};

module.exports = {
	getDogs,
};
