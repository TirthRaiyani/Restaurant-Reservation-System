const express = require('express');
const router = express.Router();
const requestRestaurant = require('../controllers/restaurantRequestController')
const { verifyJWT, authenticateAdmin, authenticateSuperAdmin } = require('../middlewares/authMiddleware')

router.post('/submitRequest', verifyJWT,requestRestaurant.submitRestaurantRequest)
router.get('/viewpending', verifyJWT,requestRestaurant.viewPendingRequests)
router.post('/handlerequest', verifyJWT, requestRestaurant.handleRestaurantRequest)
router.get('/getmyrestaurant', verifyJWT, requestRestaurant.getMyRestaurants)

module.exports = router