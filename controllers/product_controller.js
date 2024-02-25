const Sequelize = require('sequelize');
const ProductTransaction = require('../models/product_models');

// Fetch data from the third-party API and initialize the database with seed data
module.exports.initializeDatabase = async (req, res) => {
    try {
      // Fetch data from the third-party API
      const response = await fetch('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
      const data = await response.json();
      
      await ProductTransaction.bulkCreate(data);
      
      res.json({ message: 'Database initialized successfully' });
    } catch (error) {
      console.error('Error in initializeDatabase controller:', error.message);
      res.status(500).json({ error: 'Internal server error' });
    }
};
  
// API to list all transactions with search and pagination support
module.exports.getTransaction = async (req, res) => {
    try {
      const month = req.query.month;
      const searchText = req.query.searchText || '';
      const page = parseInt(req.query.page) || 1;
      const perPage = parseInt(req.query.perPage) || 10;
      const startDate = new Date(month);
      const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 12, 0);
      
      const transactions = await ProductTransaction.findAll({
        where: {
          dateOfSale: { [Sequelize.Op.between]: [startDate, endDate] }, 
          [Sequelize.Op.or]: [
            { title: { [Sequelize.Op.like]: `%${searchText}%` } },
            { description: { [Sequelize.Op.like]: `%${searchText}%` } },
            { price: { [Sequelize.Op.like]: `%${searchText}%` } }
          ]
        },
        offset: (page - 1) * perPage,
        limit: perPage
      });
      
      res.json({ transactions });
    } catch (error) {
      console.error('Error in getTransaction controller:', error.message);
      res.status(500).json({ error: 'Internal server error' });
    }
};
  
// API for statistics of a selected month
module.exports.getStatistics = async (req, res) => {
    try {
      const month = req.query.month;
      const startDate = new Date(month);
      const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 12, 0);

      const totalSaleAmount = await ProductTransaction.sum('price', {
        where: {
          dateOfSale: { [Sequelize.Op.between]: [startDate, endDate] }
        }
      });
      
      const totalSoldItems = await ProductTransaction.count({
        where: {
          dateOfSale: { [Sequelize.Op.between]: [startDate, endDate] }
        }
      });
      
      const totalNotSoldItems = await ProductTransaction.count({
        where: {
          dateOfSale: { [Sequelize.Op.between]: [startDate, endDate] },
          price: 0,
        }
      });
      
      res.json({ totalSaleAmount, totalSoldItems, totalNotSoldItems });
    } catch (error) {
      console.error('Error in getStatistics controller:', error.message);
      res.status(500).json({ error: 'Internal server error' });
    }
};
  
// API for bar chart data for a selected month
module.exports.getBarChart = async (req, res) => {
    try {
      const month = req.query.month;
      const startDate = new Date(month);
      const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 12, 0);

      const barChartData = await ProductTransaction.findAll({
        attributes: [
          [Sequelize.literal('FLOOR(price / 100) * 100'), 'priceRange'],
          [Sequelize.fn('COUNT', 'id'), 'count']
        ],
        where: {
          dateOfSale: { [Sequelize.Op.between]: [startDate, endDate] }
        },
        group: [Sequelize.literal('FLOOR(price / 100) * 100')]
      });
      
      res.json({ barChartData });
    } catch (error) {
      console.error('Error in getBarChart controller :', error);
      res.status(500).json({ error: 'Internal server error' });
    }
};
  
// API for pie chart data for a selected month
module.exports.getPieChart = async (req, res) => {
    try {
      const month = req.query.month;
      const startDate = new Date(month);
      const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 12, 0);

      const pieChartData = await ProductTransaction.findAll({
        attributes: ['category', [Sequelize.fn('COUNT', 'id'), 'count']],
        where: {
          dateOfSale: { [Sequelize.Op.between]: [startDate, endDate] }
        },
        group: ['category']
      });
      
      res.json({ pieChartData });
    } catch (error) {
      console.error('Error in getPieChart controller:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
};
  
// Combined API fetching data from other APIs
module.exports.getCombinedData = async (req, res) => {
    try {
      const month = req.query.month;
      const transactions = await fetchTransactions(month);
      const statistics = await fetchStatistics(month);
      const barChartData = await fetchBarChartData(month);
      const pieChartData = await fetchPieChartData(month);
      
      const combinedData = {
        transactions,
        statistics,
        barChartData,
        pieChartData
      };
      
      res.json(combinedData);
    } catch (error) {
      console.error('Error in getCombinedData controller:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
};
  
  // Function to fetch transactions
   const fetchTransactions = async(month) => {
    const response = await fetch(`http://localhost:3000/api/transactions?month=${month}`);
    return response.json();
  }
  
  // Function to fetch statistics
  const fetchStatistics = async (month) => {
    const response = await fetch(`http://localhost:3000/api/statistics?month=${month}`);
    return response.json();
  }
  
  // Function to fetch bar chart data
  const fetchBarChartData = async (month) => {
    const response = await fetch(`http://localhost:3000/api/bar-chart?month=${month}`);
    return response.json();
  }
  
  // Function to fetch pie chart data
  const fetchPieChartData = async (month) => {
    const response = await fetch(`http://localhost:3000/api/pie-chart?month=${month}`);
    return response.json();
  }