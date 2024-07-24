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
        const { page = 1, limit = 10 } = req.query;

        const skip = (page - 1) * limit;

        const reservations = await Reservation.find()
            .skip(skip)
            .limit(limit)
            // .populate('UserId')
            // .populate('tableId')
            // .populate('RestaurantId')         
            // .exec();

        const totalReservations = await Reservation.countDocuments();
        res.status(200).json({ StatusCode: 200, data: reservations, totalReservations, Message: 'Reservations fetched successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ StatusCode: 500, Success: false, Error: true, Message: "Something went wrong while Fetching Reservation" });
    }
}
