const { StatusCodes } = require("http-status-codes");
const apiError = require('./apiError')

class badRequestErr extends apiError {
    constructor(message) {
        super(message);
        this.statusCode = StatusCodes.BAD_REQUEST;
    }
}

module.exports = badRequestErr