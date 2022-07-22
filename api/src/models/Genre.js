const { DataTypes } = require("sequelize");
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define("genre", {
    //No voy a poner un ID ya que sequelize lo va a hacer solo
    name: {
      type: DataTypes.STRING,
    },
  });
};
