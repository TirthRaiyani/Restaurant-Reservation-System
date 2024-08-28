const express = require('express');
const router = express.Router();
const requestRestaurant = require('../controllers/restaurantRequestController')
const { verifyJWT } = require('../middlewares/authMiddleware')
const { authenticateAdmin, authenticateSuperAdmin } = require('../middlewares/roleMiddleware')

router.post('/submitRequest', authenticateAdmin,requestRestaurant.submitRestaurantRequest)
router.get('/viewpending', authenticateSuperAdmin,requestRestaurant.viewPendingRequests)
router.post('/handlerequest', authenticateSuperAdmin, requestRestaurant.handleRestaurantRequest)
router.get('/getmyrestaurant', authenticateAdmin, requestRestaurant.getMyRestaurants)

module.exports = router