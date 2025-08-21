const express = require('express')
const GameController = require('../controllers/game')
const router = express.Router()

router.get('/', GameController.read)

module.exports = router