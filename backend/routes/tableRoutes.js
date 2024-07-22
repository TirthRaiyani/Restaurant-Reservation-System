const express = require('express');
const router = express.Router();
const tableController = require('../controllers/tableController')

router.post('/create-table',tableController.creatTable)
router.get('/getAllTables', tableController.getTable)
router.put('/updateTable/:id', tableController.updateTable)
router.delete('/deleteTable/:id', tableController.deleteTable)

module.exports = router