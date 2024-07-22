require('dotenv').config()
const connectDB = require("./config/db")
const app = require('./app.js');
const env = require('./config/env.js')

connectDB()
    .then(() => {
        app.listen(env.PORT || 3000, () => {
            console.log(`Server is running on ${env.PORT}`);
        });
    })
    .catch((error) => {
        console.log("error" + error);
    });
