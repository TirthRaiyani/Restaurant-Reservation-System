const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController')
const { verifyJWT } = require('../middlewares/authMiddleware')


router.post('/makeReservation', verifyJWT, reservationController.makeReservation)
router.get('/getAllReservation', reservationController.getAllReservation)


module.exports = router