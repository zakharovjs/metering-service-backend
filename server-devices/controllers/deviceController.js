const ApiError = require('../error/ApiError')
const db = require('../db')

class DeviceController {
    async create(req, res, next) {
        try {
            const { temp, water, pressure, electicity, device_id } = req.body
            const newDevice = await db.query(
                `INSERT INTO device_data (temperature, water_level, pressure, electricity, device_id) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
                [temp, water, pressure, electicity, device_id]
            )
            res.json({ message: newDevice.rows[0] })
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    }
}

module.exports = new DeviceController()
