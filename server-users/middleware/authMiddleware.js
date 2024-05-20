const jwt = require('jsonwebtoken')

module.exports = function (req, res, next){
    if(req.method === "OPTIONS"){
        next()
    }
    try {
        const token = req.headers.authorization.split(' ')[1]
        if(!token) {
            console.log('что то не так')
            return res.status(401).json({message: "Не авторизован!"})
        }
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, user) => {
            if(error) return res.status(403).json({error: error.message});
            req.user = user;
            next();
        })
    }catch (e) {
        console.log('что то не так')
        return res.status(401).json({message: "Не авторизован!"})
    }
}


