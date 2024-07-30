const {mongoose,Schema} = require('mongoose');

// const { Schema, model } = mongoose;

const tableSchema = new mongoose.Schema({
    tableNumber: {
        type: Number,
        required: true,
        unique: true, 
    },
    restaurantId: {
        type: Schema.Types.ObjectId,
        ref: 'Restaurant', 
        required: true,
    },
    capacity: {
        type: Number,
        required: true,
    },
   
}, { timestamps: true }); 

const Table = mongoose.model('Table', tableSchema);

module.exports = Table