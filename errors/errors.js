const apiError = require("./apiError");
const unAuthorizedErr = require("./unauthorized");
const notFoundErr = require("./notFound");
const badRequestErr = require("./badRequest");

module.exports = {
  apiError,
  unAuthorizedErr,
  notFoundErr,
  badRequestErr,
};
