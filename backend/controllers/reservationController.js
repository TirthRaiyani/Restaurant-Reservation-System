const Reservation = require('../models/reservation.Model')

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
        console.error(error);
        return res.status(500).json({ StatusCode: 500, Success: false, Error: true, Message: "Something went wrong while Fetching Reservation" });
    }
}
