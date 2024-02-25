const express = require("express");
const router = express.Router();

const productController = require('../controllers/product_controller');

router.get('/initialize-database', productController.initializeDatabase);
router.get('/transactions', productController.getTransaction);
router.get('/statistics', productController.getStatistics);
router.get('/bar-chart', productController.getBarChart);
router.get('/pie-chart', productController.getPieChart);
router.get('/combined-data', productController.getCombinedData);

module.exports = router;