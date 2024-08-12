const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController')
const {verifyJWT} = require('../middlewares/authMiddleware')
const upload = require('../utils/uploads')

router.put('/edit-profile', verifyJWT,  userController.editProfile)
router.get('/get-user-count', userController.getAllUserCount)
router.get('/get-user', userController.getAllUser)
router.delete('/deleteUser/:id', verifyJWT, userController.deleteUser)
router.get('/getUserByToken/',verifyJWT,userController.getUserByToken)

module.exports = router