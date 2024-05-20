const Router = require('express')
const router = new Router()
const userController = require('../controllers/userController')
const db = require('../db')
const authMiddleware = require('../middleware/authMiddleware')
const checkRole = require('../middleware/verifyRoleMiddleware')

router.post('/signup', userController.signUp)
router.post('/signin', userController.signIn)
router.post('/refresh_token', userController.getNewTokens)
router.put('/update', authMiddleware, userController.updateUser)


module.exports = router