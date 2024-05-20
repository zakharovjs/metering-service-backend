const jwt = require('jsonwebtoken')

module.exports = function(role){
    return function (req, res, next){
        if(req.method === "OPTIONS"){
            next()
        }
        try {
            const token = req.headers.authorization.split(' ')[1]

            if(!token) {
                return res.status(401).json({message: "Не авторизован!"})
            }

            const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
            if(decoded.role !== role){
                return res.status(403).json({message: "Нет доступа!"})
            }

            req.user = decoded
            next()
        }catch (e) {
            console.log('что то не так')
            return res.status(401).json({message: "Не авторизован!"})
        }
    };
}




