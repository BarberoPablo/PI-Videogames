const { DataTypes } = require("sequelize");
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  // le pongo un img tambien?
  sequelize.define("videogame", {
    id: {
      type: DataTypes.UUID, //UUID stands for "Unique Universal IDentifier"
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    released: {
      type: DataTypes.STRING, //en la api el type es STRING y no DATEONLY
    },
    rating: {
      type: DataTypes.INTEGER,
    },
    platforms: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
    },
    //Para ahorrar tiempo de busqueda, creo una propiedad la cual solo van a tener los elementos creados en la base de datos y no en la API,
    //  esto va a ayudar a encontrar mas rápido el elemento y para no ir a buscarlo a la API
    createdInDB: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  });
};
