const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
require("express-async-errors");
require("http-status-codes");
const app = express();

// error handler
const notFoundMw = require("./middleware/notFound");
const errorHandlerMw = require("./middleware/errorHandler");

app.use(notFoundMw);
app.use(errorHandlerMw);

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Server is listening on port ${port}...`));
