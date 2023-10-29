"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyJwt = exports.createJwt = void 0;
var jsonwebtoken_1 = require("jsonwebtoken");
var createJwt = function (payload) {
    return jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_TIMEOUT,
    });
};
exports.createJwt = createJwt;
var verifyJwt = function (token) {
    var decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
    return decoded;
};
exports.verifyJwt = verifyJwt;
