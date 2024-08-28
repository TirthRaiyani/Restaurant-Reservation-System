const RestaurantRequest = require('../models/restaurantRequestModel');
const Restaurant = require('../models/restaurant.Model')
const cloudinary = require('cloudinary').v2
const path = require('path');
const env = require('../config/env')
const fs = require('fs')
const transporter = require('../config/mailer')



cloudinary.config({
    cloud_name: env.CLOUD_NAME,
    api_key: env.CLOUD_API_KEY,
    api_secret: "4trNW94BLv-YoOeD2adAYd1Y9bc"
});

const notifySuperadmin = async (request) => {
    const superadminEmail = 'tirthp990@gmail.com';

    const mailOptions = {
        from: env.EMAIL_USER,
        to: superadminEmail,
        subject: 'New Restaurant Creation Request',
        text: `A new restaurant creation request has been submitted.

Details:
- Restaurant Name: ${request.RestaurantName}
- Address: ${request.Address}
- Contact: ${request.Contact}
- City: ${request.City}
- Area: ${request.Area}

Please review the request in the admin panel.

Best regards,
Your Application Team`,
    };


    await transporter.sendMail(mailOptions);
};

exports.submitRestaurantRequest = async (req, res) => {
    try {
        const { RestaurantName, Address, Contact, City, Area,image  } = req.body;
        // console.log(req.body, "req.body")

        if (!RestaurantName || !Address || !Contact  || !City || !Area) {
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

// console.log(req.user, "userrrrr")
        const restaurantRequest = new RestaurantRequest({
            RestaurantName,
            Address,
            Contact,
            City,
            image: upload.secure_url,
            Area,
            requestedBy:req.user._id
        });

        const savedRequest = await restaurantRequest.save();
        // console.log(savedRequest)

        await notifySuperadmin(savedRequest);


        res.status(200).json({
            StatusCode: 200,
            Success: true,
            Error: false,
            data: savedRequest,
            Message: 'Restaurant creation request submitted successfully'
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            StatusCode: 500,
            Success: false,
            Error: true,
            Message: "Something went wrong while submitting the request"
        });
    }
};


exports.viewPendingRequests = async (req, res) => {
    try {
        const pendingRequests = await RestaurantRequest.find({ status: 'Pending' }).populate('requestedBy', 'name email');
        const pendingRequestCount = await RestaurantRequest.find({ status: 'Pending' }).countDocuments()
        res.status(200).json({
            StatusCode: 200,
            Success: true,
            Error: false,
            data: pendingRequests,
            count: pendingRequestCount,
            Message: 'Pending requests retrieved successfully'
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            StatusCode: 500,
            Success: false,
            Error: true,
            Message: "Something went wrong while retrieving pending requests"
        });
    }
};


exports.handleRestaurantRequest = async (req, res) => {
    try {

        const { requestId, action, rejectionReason } = req.body;
        // console.log(req.body)

        const restaurantRequest = await RestaurantRequest.findById(requestId);
        // console.log(restaurantRequest)
        if (!restaurantRequest) {
            return res.status(404).json({
                StatusCode: 404,
                Success: false,
                Error: true,
                Message: 'Request not found',
            });
        }

        if (action === 'approve') {

            const restaurant = new Restaurant({
                RestaurantName: restaurantRequest.RestaurantName,
                Address: restaurantRequest.Address,
                Contact: restaurantRequest.Contact,
                image: restaurantRequest.image,
                City: restaurantRequest.City,
                Area: restaurantRequest.Area,
                createdBy:restaurantRequest.requestedBy
            });

            const savedRestaurant = await restaurant.save();

            restaurantRequest.status = 'Approved';
            restaurantRequest.approvedAt = Date.now();
            await restaurantRequest.save();

            res.status(200).json({
                StatusCode: 200,
                Success: true,
                Error: false,
                data: savedRestaurant,
                Message: 'Restaurant created successfully'
            });

        } else if (action === 'reject') {
            restaurantRequest.status = 'Rejected';
            restaurantRequest.rejectionReason = rejectionReason;
            restaurantRequest.rejectedAt = Date.now();
            await restaurantRequest.save();
            res.status(200).json({
                StatusCode: 200,
                Success: true,
                Error: false,
                Message: 'Restaurant creation request rejected'
            });
        } else {
            return res.status(400).json({
                StatusCode: 400,
                Success: false,
                Error: true,
                Message: 'Invalid action'
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            StatusCode: 500,
            Success: false,
            Error: true,
            Message: "Something went wrong while handling the request"
        });
    }
};

exports.getMyRestaurants = async (req, res) => {
    try {
        // const adminId = req.user._id;

        // const restaurants = await Restaurant.find({ createdBy: adminId }).select('-createdBy');
        // // console.log(restaurants)
        // const restaurant = await Restaurant.findOne({ _id: restaurants }); 
        // const tableCount = restaurant.tableId.length; 

        const adminId = req.user._id;

        const restaurants = await Restaurant.find({ createdBy: adminId }).select('-createdBy');
        const restaurantsWithTableCount = restaurants.map(restaurant => {
            const tableCount = restaurant.tableId.length; 
            return {
                ...restaurant.toObject(), 
                tableCount
            };
        });


        res.status(200).json({
            StatusCode: 200,
            Success: true,
            Error: false,
            data: restaurantsWithTableCount,
            Message: 'Restaurants fetched successfully',
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            StatusCode: 500,
            Success: false,
            Error: true,
            Message: "Something went wrong while fetching restaurants",
        });
    }
};
