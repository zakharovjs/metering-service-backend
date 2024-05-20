const bcrypt = require("bcrypt");
const db = require('../db_user')
const ApiError = require("../error/ApiError");
module.exports = async function (req, res, next) {
    if (req.method === "OPTIONS") {
        next()
    }
    try {
        const {password, device_id} = req.body
        const DeviceInfo = await db.query(`SELECT * FROM devices WHERE device_id = $1`, [device_id])
        //console.log(existUser.rows[0])
        let comparePass = bcrypt.compareSync(password, DeviceInfo.rows[0].device_token)
        if (!comparePass) {
            return next(ApiError.internal('Указан неверный пароль!'))
        }

        next()
    } catch (e) {
        return res.status(401).json({message: "Не авторизован!"})
    }
}


