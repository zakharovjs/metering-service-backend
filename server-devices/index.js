const dotenv = require('dotenv');
const env = process.env.NODE_ENV || 'development';
const path = `.env.${env}`;
dotenv.config({ path });
const express = require('express')
const cors = require('cors')
const PORT = process.env.PORT || 3030
const router = require('./routes/index')
const app = express()
const errorHandler = require('./middleware/ErrorHandlingMiddleware')

app.use(cors())
app.use(express.json())
app.use('/api', router)

app.use(errorHandler)


app.listen(PORT, () => console.log(`server of devices started on ${PORT} port (${process.env.NODE_ENV})`))