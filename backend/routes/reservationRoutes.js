const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController')

router.post('/makeReservation', reservationController.makeReservation)
router.get('/getAllReservation', reservationController.getAllReservation)


module.exports = router