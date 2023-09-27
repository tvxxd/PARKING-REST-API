const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
require("express-async-errors");
require("http-status-codes");
const connectDB = require("./db/db");
const app = express();

// routers
const authRouter = require("./routes/auth");
const parkingRouter = require("./routes/parkings");
const carsRouter = require("./routes/cars");
// error handler
const notFoundMw = require("./middleware/notFound");
const errorHandlerMw = require("./middleware/errorHandler");

app.use(express.json());

// routes
// /api/auth/register
app.use("/api/auth", authRouter);
app.use("/api/parkings", parkingRouter);
app.use("/api/cars", carsRouter);

app.use(notFoundMw);
app.use(errorHandlerMw);

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Server is listening on port ${port}...`));
