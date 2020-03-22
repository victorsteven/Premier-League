import config from 'dotenv'
import express from 'express'
import bodyParser from 'body-parser'
import routes from '../routes/routes'
import mongoose from '../database/database' //db conn


config.config()
const app = express();
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/api/v1', routes)

app.get('/', (req, res) => res.status(200).send({
 Success: 'Hello! Welcome to this API.'
}));

export default app;