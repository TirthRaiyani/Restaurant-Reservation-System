const mongoose = require('mongoose')
const env = require('./env')

const connectDB = async () => {
    // console.log(env.DB_URL)
    await mongoose.connect(env.DB_URL).then(() => {
        console.log('Connected to MongoDB');
    }).catch(err => console.log(err.message))
}

module.exports = connectDB