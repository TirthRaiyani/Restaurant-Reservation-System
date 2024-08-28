const Reservation = require('../models/reservation.Model')
const Restaurant = require('../models/restaurant.Model')


exports.makeReservation = async (req, res) => {
    try {
        const { UserId, RestaurantId, tableId, date, time, NumberOfPeople } = req.body

        const reservation = new Reservation({
            UserId,
            RestaurantId,
            tableId,
            date,
            time,
            NumberOfPeople
        })
        await reservation.save()
        res.status(200).json({ StatusCode: 200, Error: false, data: reservation, Message: 'Reservation created successfully' })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ StatusCode: 500, Success: false, Error: true, Message: "Something went wrong while Creating Reservation" });
    }
}

exports.getAllReservation = async (req, res) => {
    try {
        const reservations = await Reservation.find({})
            .populate('UserId')
            .populate('tableId')
            .populate('RestaurantId')         

        const mappedReservation = {
            data: reservations.map(object => ({
                _id: object._id,
                username: object.UserId.username,
                restaurantName: object.RestaurantId ? object.RestaurantId.RestaurantName : null,
                NumberOfPeople: object.NumberOfPeople,
                Address: object.RestaurantId ? object.RestaurantId.Address : null,
                Area : object.RestaurantId ? object.RestaurantId.Area : null,
                City : object.RestaurantId ? object.RestaurantId.City : null,
                Time: object.time
            }))
        }

        const totalReservations = await Reservation.countDocuments();
        res.status(200).json({ StatusCode: 200, Success: true, Error: false, data: mappedReservation, TotalReservaation : totalReservations, Message: 'Reservations fetched successfully' });
    } catch (error) {
        console.log(error, "errrrrrrrrrrorrrrrr");
        return res.status(500).json({ StatusCode: 500, Success: false, Error: true, Message: "Something went wrong while Fetching Reservation" });
    }
}

exports.getMyReservationForUser = async (req, res) => {
    try {
        const userId = req.user._id; 

        const reservations = await Reservation.find({ userId }); 

        if (!reservations || reservations.length === 0) {
            return res.status(404).json({ StatusCode: 404, Error: true, Message: 'No reservations found for this user' });
        }

        const restaurantIds = reservations.map(reservation => reservation.RestaurantId);

        // console.log(restaurantIds, "restaurantIds");

        res.status(200).json({
            StatusCode: 200,
            Error: false,
            data: reservations,
            Message: 'Reservation fetched successfully'
        });
    } catch (error) {
        console.log(error.message, "getMyReservation failed");
        res.status(500).json({ statusCode: 500, error: true, success: false, message: "Something went wrong while fetching reservations" });
    }
};


exports.getMyReservation = async (req, res) => {
    try {
        const adminId = req.user._id; 

        const adminRestaurants = await Restaurant.find({ createdBy: adminId });

        if (!adminRestaurants || adminRestaurants.length === 0) {
            return res.status(404).json({ StatusCode: 404, Error: true, Message: 'No restaurants found for this admin' });
        }

        const restaurantIds = adminRestaurants.map(restaurant => restaurant._id);

        const reservations = await Reservation.find({ RestaurantId: { $in: restaurantIds } });

        if (!reservations || reservations.length === 0) {
            return res.status(404).json({ StatusCode: 404, Error: true, Message: 'No reservations found for these restaurants' });
        }

        res.status(200).json({
            StatusCode: 200,
            Error: false,
            data: reservations,
            Message: 'Reservations fetched successfully'
        });
    } catch (error) {
        console.log(error.message, "getMyReservation failed");
        res.status(500).json({ statusCode: 500, error: true, success: false, message: "Something went wrong while fetching reservations" });
    }
};
