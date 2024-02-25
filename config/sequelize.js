const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
        username: 'root',
        host: 'localhost',
        password: '',
        database: 'product_api_db',
        dialect: 'mysql',
        dateString:true,

     poll: {
        maxLimit : 5,
        idleTimeout: 60000
    }
});

const testConnection = async() => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

testConnection();

module.exports = sequelize;

