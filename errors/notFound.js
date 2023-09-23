const { StatusCodes } = require("http-status-codes");
const apiError = require('./apiError')

class notFoundErr extends apiError {
    constructor(message) {
        super(message);
        this.statusCode = StatusCodes.NOT_FOUND
    }
}

module.exports = notFoundErr