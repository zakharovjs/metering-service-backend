const ApiError = require('../error/ApiError')
const bcrypt = require('bcrypt')
const db = require('../db')
const db2 = require('../db_device')

class DeviceController{

    async create(req, res, next){
        try{
            const {device_model, sim_num, location, device_pass, crit_level, crit_temperature, crit_pressure} = req.body
            if (!device_model || !device_pass){
                return next(ApiError.badRequest('Некорректная модель или пароль'))
            }

            const hashPassword = await bcrypt.hash(device_pass, 5)
            const newDevice = await db.query(
                `INSERT INTO devices (device_model, sim_num, location, device_token, crit_level, crit_temperature, crit_pressure) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
                [device_model, sim_num, location, hashPassword, crit_level, crit_temperature, crit_pressure]);
            res.json({message: newDevice.rows[0]});
        } catch (error) {
            res.status(500).json({error: error.message});
        }
    }

    async link(req, res, next){
        try{
            const {deviceId, email} = req.body
            const user=  await db.query('SELECT * from users WHERE email = $1', [email])
            if (user.rows.length === 0) {
                return res.status(404).json({ error: 'Пользователь с таким email не найден' }); // return an error response if the device ID is not found or does not belong to the user
            }
            const userid = user.rows[0].id
            const update_name =  await db.query('UPDATE devices SET user_id = $1 WHERE device_id =$2', [userid, deviceId]);
            const info =  await db.query('SELECT * FROM devices WHERE device_id =$1', [deviceId])
            res.json({message : info.rows})
        }catch (error) {
            res.status(500).json({error: error.message});
        }
    }

    async deviceInfo(req, res, next){
        try {
            const id = req.user.id;
            const device_info = await db.query('SELECT * FROM devices WHERE user_id =$1', [id]);

            //console.log(device_info)
            res.json({deviceinfo : device_info.rows})
        }catch (error) {
            res.status(500).json({error: error.message});
        }
    }
    async getDataId(req, res, next){
        const fields = req.query.fields;
        const limit = req.query.limit;
        const device_id = req.query.id;
        const id = req.user.id;
        let queryFields = '*'; //default - select all fields
        const deviceData = [];

        if (fields) {
            queryFields = fields+',created_at';
        }

        try {

            const devicesResult = await db.query(`SELECT * FROM devices WHERE user_id = $1 AND device_id = $2`, [id, device_id]);
            if (devicesResult.rows.length === 0) {
                return res.status(404).json({ error: 'Устройство не найдено или не принадлежит пользователю' }); // return an error response if the device ID is not found or does not belong to the user
            }
            const {rows} = await db2.query(`SELECT ${queryFields} FROM device_data WHERE device_id = $1 ORDER BY created_at DESC LIMIT $2`, [device_id, limit]);
            res.json({deviceDataResult: rows})

        }catch (error) {
            res.status(500).json({error: error.message});
        }
    }


    async getDeviceData(req, res, next){
        const fields = req.query.fields; //fields - temperature,water_level,pressure,electricity
        const limit = req.query.limit;
        const id = req.user.id;
        let queryFields = '*'; //default - select all fields
        const deviceData = [];

        if (fields) {
            queryFields = fields+',created_at';
        }

        try {
            const deviceIds= await db.query('SELECT device_id FROM devices WHERE user_id =$1', [id]);
            const foundDeviceIds = deviceIds.rows.map((row) => row.device_id);
            //console.log(foundDeviceIds);
            //console.log(foundDeviceIds.length);

            for (let i = 0; i < foundDeviceIds.length; i++) {
                const IdDevice = foundDeviceIds[i];

                const deviceDataResult = await db2.query(`SELECT ${queryFields} FROM device_data WHERE device_id = $1 ORDER BY created_at DESC LIMIT $2`, [IdDevice, limit]);
                const device = {
                    device_id: IdDevice,
                    data: deviceDataResult.rows,
                };
                deviceData.push(device);
            }
            res.json(deviceData)

        }catch (error) {
            res.status(500).json({error: error.message});
        }
    }

}

module.exports = new DeviceController()