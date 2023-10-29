"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var ProductSchema = new mongoose_1.Schema({
    name: String,
    brand: String,
    price: Number,
    category: String,
    description: String,
    link: String,
});
exports.default = (0, mongoose_1.model)('Product', ProductSchema);
