"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateProduct = exports.validateLoginUser = exports.validateRegisterUser = exports.validationMiddleware = void 0;
var express_validator_1 = require("express-validator");
var User_1 = require("../model/User");
var customErrors_1 = require("../errors/customErrors");
var Products_1 = require("../model/Products");
var mongoose_1 = require("mongoose");
var validationMiddleware = function (validate) {
    return [
        validate,
        function (req, res, next) {
            var errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                var errorMessages = errors
                    .array()
                    .map(function (err) { return err.msg; });
                if (errorMessages[0].startsWith('Cast')) {
                    throw new customErrors_1.NotFoundError('Invalid Product id');
                }
                throw new customErrors_1.BadRequestError(errorMessages);
            }
            next();
        },
    ];
};
exports.validationMiddleware = validationMiddleware;
// REGISTER AND LOGIN
exports.validateRegisterUser = (0, exports.validationMiddleware)([
    (0, express_validator_1.body)('name')
        .notEmpty()
        .withMessage('Name cannot be empty')
        .isLength({ max: 40, min: 5 })
        .withMessage('Name must be between 5 and 40 characters'),
    (0, express_validator_1.body)('email')
        .notEmpty()
        .withMessage('Email cannot be empty')
        .isEmail()
        .withMessage('invalid email')
        .custom(function (email) { return __awaiter(void 0, void 0, void 0, function () {
        var isUserExist;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, User_1.default.findOne({ email: email.toLowerCase() })];
                case 1:
                    isUserExist = _a.sent();
                    if (isUserExist)
                        throw new customErrors_1.BadRequestError('An user with the email address already exists');
                    return [2 /*return*/];
            }
        });
    }); }),
    (0, express_validator_1.body)('password')
        .notEmpty()
        .withMessage('Password cannot be empty')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters'),
]);
exports.validateLoginUser = (0, exports.validationMiddleware)([
    (0, express_validator_1.body)('email')
        .notEmpty()
        .withMessage('Email cannot be empty')
        .isEmail()
        .withMessage('invalid email'),
    (0, express_validator_1.body)('password').notEmpty().withMessage('Password cannot be empty'),
]);
// PRODUCTS
exports.validateProduct = (0, exports.validationMiddleware)([
    (0, express_validator_1.param)('id').custom(function (id) { return __awaiter(void 0, void 0, void 0, function () {
        var isValidMongoId, isProductAvailable;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    isValidMongoId = mongoose_1.Types.ObjectId.isValid(id);
                    return [4 /*yield*/, Products_1.default.findById(id)];
                case 1:
                    isProductAvailable = _a.sent();
                    if (!isValidMongoId)
                        throw new customErrors_1.BadRequestError('');
                    if (!isProductAvailable)
                        throw new customErrors_1.NotFoundError('No product by that id');
                    return [2 /*return*/];
            }
        });
    }); }),
]);
