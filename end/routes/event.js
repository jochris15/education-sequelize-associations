const express = require('express')
const EventController = require('../controllers/event')
const router = express.Router()

router.get('/', EventController.read)
router.get('/detail/:id', EventController.detail)
router.get('/add', EventController.addForm)
router.post('/add', EventController.add)
router.get('/edit/:id', EventController.editForm)
router.post('/edit/:id', EventController.edit)
router.get('/delete/:id', EventController.delete)


module.exports = router