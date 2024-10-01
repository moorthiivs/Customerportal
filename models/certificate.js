"use strict";

module.exports = (sequelize, DataTypes) => {
  const Certificate = sequelize.define("Certificate", {
    // Model attributes are defined here
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    filename: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    srfId: {
      type: DataTypes.INTEGER,
    },
    srfNo: {
      type: DataTypes.STRING,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    make: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    model: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    serialno: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    idno: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    master_certificate_filename: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    rstatus: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });
  Certificate.associate = function (models) {
    // define association here
    Certificate.belongsTo(models.Company, {
      as: "company",
      constrains: true,
      onDelete: "CASCADE",
    });
  };
  return Certificate;
};
