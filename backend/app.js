const express = require('express')
const cors = require('cors')

const app = express()

app.use(cors());
app.use(express.json({ limit: "50mb" }));

const authRouter = require('./routes/authRoutes')
const userRouter = require('./routes/userRoutes')
const restaurantRouter = require('./routes/restaurantRoutes')
const tableRouter = require('./routes/tableRoutes')
const reservationRouter = require('./routes/reservationRoutes')
app.use("/api", authRouter)
app.use("/api/user", userRouter)
app.use("/api/restaurant", restaurantRouter)
app.use("/api/table", tableRouter)
app.use("/api/reservation", reservationRouter)




module.exports = app