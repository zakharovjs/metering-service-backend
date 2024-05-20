const Router = require('express')
const router = new Router()
const deviceController = require('../controllers/deviceController')
const db = require('../db')
const authMiddleware = require('../middleware/authMiddleware')


router.post('/add', authMiddleware, deviceController.create)

module.exports = router