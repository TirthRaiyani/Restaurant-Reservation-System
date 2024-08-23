const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurantController')
const upload = require('../utils/uploads')
const { verifyJWT } = require('../middlewares/authMiddleware')

router.post('/createRestaurant', verifyJWT, restaurantController.createRestaurant)
router.get('/getAllRestaurant', verifyJWT, restaurantController.getRestaurant)
router.put('/updateRestaurant/:id', verifyJWT, restaurantController.updateRestaurant)
router.delete('/deleteRestaurant/:id', verifyJWT, restaurantController.deleteRestaurant)
router.get('/getPopularRestaurants', verifyJWT, restaurantController.getPopularRestaurants)

module.exports = router