const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurantController')
const upload = require('../utils/uploads')
const { verifyJWT } = require('../middlewares/authMiddleware')
const { authenticateAdmin, authenticateSuperAdmin } = require('../middlewares/roleMiddleware')


router.post('/createRestaurant', verifyJWT, restaurantController.createRestaurant)
router.get('/getAllRestaurant', authenticateSuperAdmin, restaurantController.getRestaurant)
router.put('/updateRestaurant/:id', verifyJWT, restaurantController.updateRestaurant)
router.delete('/deleteRestaurant/:id', authenticateSuperAdmin, restaurantController.deleteRestaurant)
router.get('/getPopularRestaurants', authenticateSuperAdmin, restaurantController.getPopularRestaurants)

module.exports = router