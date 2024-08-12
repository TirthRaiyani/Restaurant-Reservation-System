const express = require('express');
const router = express.Router();
const tableController = require('../controllers/tableController')
const {verifyJWT} = require('../middlewares/authMiddleware')

router.post('/create-table',verifyJWT,tableController.creatTable)
router.get('/getAllTables', verifyJWT, tableController.getTable)
router.put('/updateTable/:id', verifyJWT, tableController.updateTable)
router.delete('/deleteTable/:id', verifyJWT, tableController.deleteTable)

module.exports = router