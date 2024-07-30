const Restaurant = require('../models/restaurant.Model')
const cloudinary = require('cloudinary').v2
const path = require('path');
const env = require('../config/env')
const fs = require('fs')


cloudinary.config({
    cloud_name: env.CLOUD_NAME,
    api_key: env.CLOUD_API_KEY,
    api_secret: "4trNW94BLv-YoOeD2adAYd1Y9bc"
});

// exports.createRestaurant = async (req, res) => {
//     try {
//         const { RestaurantName, Address, Contact , image} = req.body
//         // console.log(req.file.filename)

//         const filePath = path.join(__dirname + './../uploads/' + req.file.filename)
//         console.log(filePath, "path");
//         console.log(filePath)
//         const upload = await cloudinary.uploader.upload(filePath, {
//             folder: 'uploads'
//         })
//         console.log(upload)

//         if (!RestaurantName || !Address || !Contact) {
//             return res.status(400).json({
//                 StatusCode: 400,
//                 Success: false,
//                 Error: true,
//                 Message: 'All fields are required',
//             });
//         }
//         const restaurant = new Restaurant({
//             RestaurantName,
//             Address,
//             Contact,
//             image: upload.secure_url
//         })
//         const savedRestaurant = await restaurant.save()
//         console.log(savedRestaurant)
//         res.status(200).json({ StatusCode: 200, Success: true, Error: false, data: restaurant, Message: 'Restaurant created successfully' })

//     } catch (error) {
//         console.log(error);
//         return res.status(500).json({ StatusCode: 500, Success: false, Error: true, Message: "Something went wrong while Creating Restaurant" });
//     }
// }

exports.createRestaurant = async (req, res) => {
    try {
        const { RestaurantName, Address, Contact, image } = req.body;

        if (!RestaurantName || !Address || !Contact || !image) {
            return res.status(400).json({
                StatusCode: 400,
                Success: false,
                Error: true,
                Message: 'All fields are required',
            });
        }


        const imageBuffer = Buffer.from(image, 'base64');
        const tempFilePath = path.join(__dirname, './../uploads/', `temp_image_${Date.now()}.jpg`);

        fs.writeFileSync(tempFilePath, imageBuffer);

        const upload = await cloudinary.uploader.upload(tempFilePath, {
            folder: 'uploads'
        });

        fs.unlinkSync(tempFilePath);

        const restaurant = new Restaurant({
            RestaurantName,
            Address,
            Contact,
            image: upload.secure_url
        });

        const savedRestaurant = await restaurant.save();
        console.log(savedRestaurant);

        res.status(200).json({
            StatusCode: 200,
            Success: true,
            Error: false,
            data: restaurant,
            Message: 'Restaurant created successfully'
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            StatusCode: 500,
            Success: false,
            Error: true,
            Message: "Something went wrong while Creating Restaurant"
        });
    }
}



exports.updateRestaurant = async (req, res) => {
    upload.single('Image')(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ StatusCode: 400, Success: false, Error: true, Message: err });
        }
        try {
            const { id } = req.params;
            const { RestaurantName, Address, Contact } = req.body;

            let imageUrl;
            if (req.file) {
                const filePath = path.join(__dirname, './../uploads/', req.file.filename);
                const uploadResponse = await cloudinary.uploader.upload(filePath, { folder: 'uploads' });
                imageUrl = uploadResponse.secure_url;
            }

            const updatedFields = { RestaurantName, Address, Contact };
            if (imageUrl) {
                updatedFields.image = imageUrl;
            }

            const updatedRestaurant = await Restaurant.findByIdAndUpdate(
                id,
                updatedFields,
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
                Success: true,
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
    });
};

exports.getRestaurant = async (req, res) => {
    try {
        const restaurants = await Restaurant.find({})

        if (!restaurants.length) {
            throw new res.json({ statuscode: 404, Message: 'No Restaurants found' });
        }

        res.status(200).json({ statuscode: 200, Success: true, Error: false, data: restaurants, Message: 'Restaurants fetched successfully' });

    } catch (error) {
        console.log(error.Message);
        return res.status(500).json({ StatusCode: 500, Success: false, Error: true, Message: "Something went wrong while fetching Restaurants" })
    }

}

exports.deleteRestaurant = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedRestaurant = await Restaurant.findByIdAndDelete(id);

        if (!deletedRestaurant) {
            return res.status(404).json({ StatusCode: 404, Error: true, Success: false, Message: "No restaurant found" })
        }
    res.status(200).json({ StatusCode: 200, Error: false, data: deletedRestaurant, Message: 'Restaurant deleted successfully' })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ StatusCode: 500, Success: false, Error: true, Message: "Something went wrong while deleting restaurant" });
    }
}

exports.getPopularRestaurants = async (req, res) => {
    try {
        const restaurants = await Restaurant.find({}).limit(5)

        if (!restaurants.length) {
            throw new res.json({ statuscode: 404, Message: 'No Restaurants found' });
        }

        res.status(200).json({ statuscode: 200, data: restaurants, Message: 'Restaurants fetched successfully' });

    } catch (error) {
        console.log(error.Message);
        return res.status(500).json({ StatusCode: 500, Success: false, Error: true, Message: "Something went wrong while fetching Restaurants" })
    }
}














