"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var auth_1 = require("../controllers/auth");
var validationMiddleware_1 = require("../middleware/validationMiddleware");
var router = (0, express_1.Router)();
router
    .post('/register', validationMiddleware_1.validateRegisterUser, auth_1.registerUser)
    .get('/login', validationMiddleware_1.validateLoginUser, auth_1.loginUser)
    .get('/logout', auth_1.logoutUser);
exports.default = router;
