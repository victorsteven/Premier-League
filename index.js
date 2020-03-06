import express from 'express'
import bodyParser from 'body-parser'
import { mongoose } from './database/database'

import routes from './routes/routes'


const app = express();
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }));

const port = process.env.PORT || 8000;

// app.get('*', (req, res) => res.status(200).send({
//  message: 'Welcome to this API.'
// }));

app.use('/api/v1', routes)

app.get('/hello', (req, res) => res.status(200).send({
 message: 'Hello! Welcome to this API.'
}));

app.listen(port, () => {
 console.log(`Server is running on PORT ${port}`);
})

export default app;