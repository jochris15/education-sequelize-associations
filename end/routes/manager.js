const express = require('express')
const ManagerController = require('../controllers/manager')
const router = express.Router()

router.get('/', ManagerController.read)

module.exports = router