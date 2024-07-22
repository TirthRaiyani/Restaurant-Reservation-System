const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurantController')
const upload = require('../utils/uploads')

router.post('/createRestaurant',upload.single("image"), restaurantController.createRestaurant)
router.post('/getAllRestaurant', restaurantController.getRestaurant)
router.put('/updateRestaurant/:id', restaurantController.updateRestaurant)
router.delete('/deleteRestaurant/:id', restaurantController.deleteRestaurant)

module.exports = router