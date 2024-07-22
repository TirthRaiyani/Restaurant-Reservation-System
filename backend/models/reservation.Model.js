const {mongoose,Schema} = require('mongoose')

const reservationSchema = new mongoose.Schema({
    UserId : {
        type : Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    tableId : {
        type : Schema.Types.ObjectId,
        ref: 'Table',
        required: true
    },
    RestaurantId : {
        type : Schema.Types.ObjectId,
        ref: 'Restaurant',
        required: true
    },
    date : {
        type : String,
        required: true
    },
    time:{
        type : String,
        required: true,
    },
    NumberOfPeople:{
        type : Number,
        required: true,
    }
})

const Reservation = mongoose.model("Reservation",reservationSchema)

module.exports = Reservation