const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController')
const { verifyJWT } = require('../middlewares/authMiddleware')
const { authenticateAdmin, authenticateSuperAdmin } = require('../middlewares/roleMiddleware')


router.post('/makeReservation', verifyJWT, reservationController.makeReservation)
router.get('/getAllReservation', authenticateSuperAdmin, reservationController.getAllReservation)
router.get('/getMyReservation', authenticateAdmin, reservationController.getMyReservation)
router.get('/getMyReservationForUser', verifyJWT, reservationController.getMyReservationForUser)

module.exports = router