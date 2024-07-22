const mongoose = require('mongoose');

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
    image: {
        type: String,
        required: false 
    }
});

const Restaurant = mongoose.model("Restaurant", restaurantSchema);
module.exports = Restaurant;
