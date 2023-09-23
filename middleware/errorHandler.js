const { apiError } = require("../errors/apiError");
const { StatusCodes } = require("http-status-codes");
const errorHandlerMw = (err, req, res, next) => {
  if (err instanceof apiError) {
    return res.status(err.StatusCode).json({ message: err.message });
  }
  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err });
};


module.exports = errorHandlerMw