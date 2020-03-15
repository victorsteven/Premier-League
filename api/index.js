import config from 'dotenv'
import express from 'express'
import bodyParser from 'body-parser'
import { mongoose } from './database/database' //db conn

import routes from './routes/routes'

config.config()
const app = express();
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }));

const port = process.env.PORT || 8000;


app.use('/api/v1', routes)

app.get('/', (req, res) => res.status(200).send({
 Success: 'Hello! Welcome to this API.'
}));

app.listen(port, () => {
 console.log(`Server is running on PORT ${port}`);
})

export default app;