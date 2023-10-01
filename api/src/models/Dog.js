const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {

  sequelize.define("dog", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true, 
      unique: true,
      autoIncrement: true,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    height: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    weight: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    life_span: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
};
