import express from 'express'
import bodyParser from 'body-parser'

const app = express();

app.use(bodyParser.json())

app.use(bodyParser.urlencoded({ extended: false }));

const port = process.env.PORT || 8000;

// app.get('*', (req, res) => res.status(200).send({
//  message: 'Welcome to this API.'
// }));

app.get('/hello', (req, res) => res.status(200).send({
 message: 'Hello! Welcome to this API.'
}));

app.listen(port, () => {
 console.log(`Server is running on PORT ${port}`);
})

export default app;