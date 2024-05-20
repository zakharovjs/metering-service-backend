const Router = require('express')
const router = new Router()
const deviceController = require('../controllers/deviceController')
const db = require('../db')
const db2 = require('../db_device')
const authMiddleware = require('../middleware/authMiddleware')
const checkRole = require('../middleware/verifyRoleMiddleware')

router.post('/create', authMiddleware, checkRole('ADMIN'), deviceController.create)
router.put('/link', authMiddleware, checkRole('ADMIN'), deviceController.link)
router.get('/getinfo', authMiddleware, deviceController.deviceInfo)
router.get('/getdata', authMiddleware, deviceController.getDeviceData)
router.get('/getdataid', authMiddleware, deviceController.getDataId)


module.exports = router