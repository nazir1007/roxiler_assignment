const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize')


const ProductTransaction = sequelize.define('ProductTransaction', {
      title: {
        type: DataTypes.STRING,
        allowNull: false
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      price: {
        type: DataTypes.FLOAT,
        allowNull: false
      },
      category: {
        type: DataTypes.STRING,
        allowNull: false
      },
      dateOfSale : {
        type: DataTypes.DATE,
        allowNull: false
      }
  });

  (async () => {
    await ProductTransaction.sync({ alter: true });
  })();

  module.exports = ProductTransaction;