const Table = require('../models/table.Model')

exports.creatTable = async(req,res) =>{
    try {
        const { tableNumber, restaurantId, capacity, location } = req.body

        const table = new Table({
            tableNumber,
            restaurantId,
            capacity,
            location
        })
        await table.save()
        res.status(200).json({ StatusCode: 200, Error: false, data: table, Message: 'Table created successfully' })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ StatusCode: 500, Success: false, Error: true, Message: "Something went wrong while Creating Table" });
    }
}

exports.getTable = async (req, res) => {
    try {
        const page = parseFloat(req.query.page) || 1;
        const limit = parseFloat(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const searchQuery = req.query.search || '';

        const sortField = req.query.sortBy || '_id';
        const sortOrder = req.query.order || 'asc';

        const sortOptions = {};
        sortOptions[ sortField ] = sortOrder === 'desc' ? -1 : 1;

        const query = {
            $or: [
                { location: { $regex: searchQuery, $options: 'i' } }
            ]
        };

        const table = await Table.find(query)
            .sort(sortOptions)
            .skip(skip)
            .limit(limit);

        if (!table.length) {
            throw new ApiError(404, 'No table found');
        }

        res.status(200).json({ StatusCode: 200, data: table, Message: 'Tables fetched successfully' });


    } catch (error) {
        console.log(error.Message);
        return res.status(500).json({ StatusCode: 500, Success: false, Error: true, Message: "Something went wrong while fetching Tables" });
    }

}


exports.updateTable = async (req, res) => {
    try {
        const { id } = req.params;
        const { capacity, location } = req.body;

        const updatedTable = await Table.findByIdAndUpdate(
            id,
            { capacity, location},
            { new: true, runValidators: true }
        );

        if (!updatedTable) {
            return res.status(404).json({
                StatusCode: 404,
                Error: true,
                Success: false,
                Message: "No table found"
            });
        }

        res.status(200).json({
            StatusCode: 200,
            Error: false,
            data: updatedTable,
            Message: 'Table updated successfully'
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            StatusCode: 500,
            Success: false,
            Error: true,
            Message: "Something went wrong while updating Table"
        });
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