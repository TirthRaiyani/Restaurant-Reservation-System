const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurantController')

router.post('/createRestaurant', restaurantController.createRestaurant)
router.post('/getAllRestaurant', restaurantController.getRestaurant)
router.put('/updateRestaurant/:id', restaurantController.updateRestaurant)
router.delete('/deleteRestaurant/:id', restaurantController.deleteRestaurant)

module.exports = router