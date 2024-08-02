const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurantController')
const upload = require('../utils/uploads')
const {verifyJWT} = require('../middlewares/authMiddleware')

router.post('/createRestaurant',upload.single("image"),restaurantController.createRestaurant)
router.get('/getAllRestaurant', restaurantController.getRestaurant)
router.put('/updateRestaurant/:id', restaurantController.updateRestaurant)
router.delete('/deleteRestaurant/:id', restaurantController.deleteRestaurant)
router.get('/getPopularRestaurants',verifyJWT,restaurantController.getPopularRestaurants)

module.exports = router