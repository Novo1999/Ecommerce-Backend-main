"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var http_status_codes_1 = require("http-status-codes");
var errorHandlerMiddleware = function (err, req, res, next) {
    var statusCode = err.statusCode || http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR;
    var msg = err.message || 'Something went wrong';
    res.status(statusCode).json({ msg: msg });
};
exports.default = errorHandlerMiddleware;
