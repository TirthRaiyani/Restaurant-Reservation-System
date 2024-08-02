const { mongoose, Schema } = require('mongoose');

const restaurantSchema = new mongoose.Schema({
    RestaurantName: {
        type: String,
        required: true
    },
    Address: {
        type: String,
        required: true
    },
    Contact: {
        type: String,
        required: true
    },
    City:{
        type: String,
        required: true
    },
    Area:{
        type: String,
        required: true
    },
    image: {
        type: String,
        required: false 
    },
    tableId:[{
        type: Schema.Types.ObjectId,
        ref:'Table',
    }]
});

const Restaurant = mongoose.model("Restaurant", restaurantSchema);
module.exports = Restaurant;
