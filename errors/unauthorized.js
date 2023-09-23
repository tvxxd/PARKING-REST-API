const { StatusCodes } = require("http-status-codes");
const apiError = require('./apiError');

class unAuthorizedErr extends apiError {
    constructor(message) {
        super(message);
        this.statusCode = StatusCodes.UNAUTHORIZED
    }
}

module.exports = unAuthorizedErr