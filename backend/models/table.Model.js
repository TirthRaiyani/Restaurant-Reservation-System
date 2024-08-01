const {mongoose,Schema} = require('mongoose');

// const { Schema, model } = mongoose;

const tableSchema = new mongoose.Schema({
    tableNumber: {
        type: String,
        required: true, 
    },
    restaurantId: {
        type: Schema.Types.ObjectId,
        ref: 'Restaurant', 
        required: true,
    },
    capacity: {
        type: String,
        required: true,
    },
   
}, { timestamps: true }); 

tableSchema.pre('remove', async function (next) {
    try {
        await Restaurant.updateOne(
            { _id: this.restaurantId },
            { $pull: { tableId: this._id } }
        );
        next();
    } catch (error) {
        next(error);
    }
});

const Table = mongoose.model('Table', tableSchema);

module.exports = Table