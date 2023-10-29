"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var products_1 = require("../controllers/products");
var validationMiddleware_1 = require("../middleware/validationMiddleware");
var router = (0, express_1.Router)();
router
    .get('/all-product?:sort', products_1.getAllProducts)
    .get('/product/:id', validationMiddleware_1.validateProduct, products_1.getSingleProduct)
    .get('/product?:category', products_1.getProductByCategory);
exports.default = router;
