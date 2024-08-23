const {Schema,mongoose} = require('mongoose');


const RestaurantRequestSchema = new Schema({
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
    },
    City: {
        type: String,
        required: true
    },
    Area: {
        type: String,
        required: true
    },
    requestedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',  
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected'], 
        default: 'Pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    approvedAt: {
        type: Date
    },
    rejectedAt: {
        type: Date
    },
    rejectionReason: {
        type: String ,
        default:null
    }
});

const RestaurantRequest = mongoose.model('RestaurantRequest', RestaurantRequestSchema);
module.exports = RestaurantRequest
