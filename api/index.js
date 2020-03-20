import mongoose from './database/database' //db conn
import app from './app/app'

const port = process.env.PORT || 8000;

app.listen(port, () => {
 console.log(`Server is running on PORT ${port}`);
})
