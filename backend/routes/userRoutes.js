const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController')
const {verifyJWT} = require('../middlewares/authMiddleware')

router.put('/edit-profile', verifyJWT, userController.editProfile)
router.get('/get-user-count', userController.getAllUserCount)
router.get('/get-user', userController.getAllUser)
router.delete('/deleteUser/:id', verifyJWT, userController.deleteUser)

module.exports = router