"use strict";
/*
1. Get all products
2. Get a single product
3. Filter by category
4. Sort by price (low - high / high - low) / Alphabetical order (A - Z / Z - A)
5.
*/
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
exports.getProductByCategory = exports.getSingleProduct = exports.getAllProducts = void 0;
var Products_1 = require("../model/Products");
var http_status_codes_1 = require("http-status-codes");
var customErrors_1 = require("../errors/customErrors");
var sortBy = function (sort) {
    switch (sort) {
        case 'a-z':
            return { name: 'asc' };
        case 'z-a':
            return { name: 'desc' };
        case 'price[a-z]':
            return { price: 'asc' };
        case 'price[z-a]':
            return { price: 'desc' };
        default:
            throw new customErrors_1.BadRequestError('Wrong query');
    }
};
// when page loads
var getAllProducts = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var sort, products;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                sort = req.query.sort;
                return [4 /*yield*/, Products_1.default.find({}).sort(sortBy(sort))];
            case 1:
                products = _a.sent();
                res.status(http_status_codes_1.StatusCodes.OK).json(products);
                return [2 /*return*/];
        }
    });
}); };
exports.getAllProducts = getAllProducts;
// when user clicks on a product, he can see that and also 3 related products
var getSingleProduct = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, product, relatedProducts;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = req.params.id;
                return [4 /*yield*/, Products_1.default.findById(id)
                    // this returns 3 related products that matches the category and makes sure the same product is not returned
                ];
            case 1:
                product = _a.sent();
                return [4 /*yield*/, Products_1.default.find({
                        category: product === null || product === void 0 ? void 0 : product.category,
                    })
                        .where('_id')
                        .ne(id)
                        .limit(3)];
            case 2:
                relatedProducts = _a.sent();
                res.status(http_status_codes_1.StatusCodes.OK).json({ product: product, relatedProducts: relatedProducts });
                return [2 /*return*/];
        }
    });
}); };
exports.getSingleProduct = getSingleProduct;
// user chooses category from dropdown or types in url
var getProductByCategory = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, category, sort, products;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.query, category = _a.category, sort = _a.sort;
                // if no sort was provided, just sort by ascending order
                if (!sort)
                    sort = 'asc';
                return [4 /*yield*/, Products_1.default.find({
                        category: { $regex: ".*".concat(category), $options: 'i' },
                    }).sort(sortBy(sort))];
            case 1:
                products = _b.sent();
                if (!products.length)
                    return [2 /*return*/, res
                            .status(http_status_codes_1.StatusCodes.NOT_FOUND)
                            .json({ msg: 'No product by that category' })];
                res.status(http_status_codes_1.StatusCodes.OK).json(products);
                return [2 /*return*/];
        }
    });
}); };
exports.getProductByCategory = getProductByCategory;
