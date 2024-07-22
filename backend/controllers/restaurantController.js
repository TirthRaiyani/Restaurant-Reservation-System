const { name } = require('ejs');
const Restaurant = require('../models/restaurant.Model')

exports.createRestaurant = async(req,res) =>{
    try {
        const { RestaurantName,Address,Contact } = req.body

        const restaurant = new Restaurant({
            RestaurantName,
            Address,
            Contact
        })
        await restaurant.save()
        res.status(200).json({ StatusCode: 200, Success: true, Error:false,data : restaurant, Message :'Restaurant created successfully'})

    } catch (error) {
        console.log(error);
        return res.status(500).json({ StatusCode: 500, Success: false, Error: true, Message: "Something went wrong while Creating Restaurant" });
    }
}

exports.getRestaurant = async (req, res) => {
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
                { RestaurantName: { $regex: searchQuery, $options: 'i' } }
            ]
        };

        const restaurants = await Restaurant.find(query)
            .sort(sortOptions)
            .skip(skip)
            .limit(limit);

        if (!restaurants.length) {
            throw new ApiError(404, 'No Restaurants found');
        }

        res.status(200).json({ StatusCode: 200, data: restaurants, Message: 'Restaurants fetched successfully' });


    } catch (error) {
        console.log(error.Message);
        return res.status(500).json({ StatusCode: 500, Success: false, Error: true, Message: "Something went wrong while fetching Restaurants" });
    }

}

exports.updateRestaurant = async (req, res) => {
    try {
        const { id } = req.params;
        const { RestaurantName, Address, Contact } = req.body;

        const updatedRestaurant = await Restaurant.findByIdAndUpdate(
            id,
            { RestaurantName, Address, Contact },
            { new: true, runValidators: true }
        );

        if (!updatedRestaurant) {
            return res.status(404).json({
                StatusCode: 404,
                Error: true,
                Success: false,
                Message: "No restaurant found"
            });
        }

        res.status(200).json({
            StatusCode: 200,
            Error: false,
            data: updatedRestaurant,
            Message: 'Restaurant updated successfully'
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            StatusCode: 500,
            Success: false,
            Error: true,
            Message: "Something went wrong while updating restaurant"
        });
    }
}

exports.deleteRestaurant = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedRestaurant = await Restaurant.findByIdAndDelete(id);

        if (!deletedRestaurant) {
             return res.status(404).json({ StatusCode: 404, Error: true, Success: false, Message: "No restaurant found"})
        }

        res.status(200).json({ StatusCode: 200,  Error: false, data: deletedRestaurant, Message: 'Restaurant deleted successfully' })
    }catch(error){
        console.log(error);
        return res.status(500).json({ StatusCode: 500, Success: false, Error: true, Message: "Something went wrong while deleting restaurant"});
    }
}