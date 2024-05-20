const Router = require('express')
const router = new Router
const userRouter = require('./userRouter')
const deviceRouter = require('./deviceRouter')

router.use('/user', userRouter)
router.use('/device', deviceRouter)


module.exports = router