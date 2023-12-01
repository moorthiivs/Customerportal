"use strict";

module.exports = (sequelize, DataTypes) => {
  const Lab = sequelize.define("Lab", {
    // Model attributes are defined here
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address1: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address2: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address3: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    contactNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    symbol: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    limageName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    limageType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    limageData: {
      type: DataTypes.BLOB("long"),
      allowNull: false,
    },
    rstatus: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });
  return Lab;
};
