export default (sequelize, DataTypes) => {
  const Category = sequelize.define("category", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.STRING,
    },
  });

  return Category;
};
