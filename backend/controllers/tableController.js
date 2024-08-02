const Table = require('../models/table.Model')
const Restaurant = require('../models/restaurant.Model')
exports.creatTable = async(req,res) =>{
    try {
        const { tableNumber, restaurantId, capacity } = req.body

        if (!tableNumber || !restaurantId || !capacity) {
            return res.status(400).json({ StatusCode: 400, Error: true, Message: 'All fields are required' });
        }

        const table = new Table({
            tableNumber,
            restaurantId,
            capacity
        })
       
        const savedTable = await table.save()

        console.log(savedTable)
        const updatedRestaurant = await Restaurant.findByIdAndUpdate(
            restaurantId,
            {
                $push: {
                    tableId: savedTable._id 
                }
            },
            {new: true, useFindAndModify: false}
        );
        console.log(updatedRestaurant,  "updatedRestaurant")
        res.status(200).json({ StatusCode: 200, Error: false, data: { table, updatedRestaurant }, Message: 'Table created successfully' })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ StatusCode: 500, Success: false, Error: true, Message: "Something went wrong while Creating Table" });
    }
}

exports.getTable = async (req, res) => {
    try {
        const tables = await Table.find({}).populate('restaurantId').exec()

        if (!tables.length) {
            throw new res.json({ statuscode: 404, Message: 'No Table found' });
        }

        res.status(200).json({ statuscode: 200, Success: true, Error: false, data: tables, Message: 'Tables fetched successfully' });

    } catch (error) {
        console.log(error.Message);
        return res.status(500).json({ StatusCode: 500, Success: false, Error: true, Message: "Something went wrong while fetching Tables" })
    }

}
  

exports.updateTable = async (req, res) => {
    try {
        const { id } = req.params;
        const { capacity } = req.body;

        const updatedTable = await Table.findByIdAndUpdate(
            id,
            { capacity},
            { new: true, runValidators: true }
        );

        if (!updatedTable) {
            return res.status(404).json({ StatusCode: 404, Error: true, Success: false, Message: "No table found" })}

        res.status(200).json({StatusCode: 200,Error: false,data: updatedTable,Message: 'Table updated successfully'});

    } catch (error) {
        console.log(error);
        return res.status(500).json({ StatusCode: 500, Success: false,Error: true, Message: "Something went wrong while updating Table" });
    }
}

exports.deleteTable = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedTable = await Table.findByIdAndDelete(id);

        if (!deletedTable) {
            return res.status(404).json({ StatusCode: 404, Error: true, Success: false, Message: "No Table found" })
        }

        res.status(200).json({ StatusCode: 200, Error: false, data: deletedTable, Message: 'Table deleted successfully' })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ StatusCode: 500, Success: false, Error: true, Message: "Something went wrong while deleting table" });
    }
}