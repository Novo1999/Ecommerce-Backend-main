"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var UserSchema = new mongoose_1.Schema({
    name: String,
    email: String,
    password: String,
});
// delete the password in the response
UserSchema.methods.toJSON = function () {
    var user = this.toObject();
    delete user.password;
    return user;
};
exports.default = (0, mongoose_1.model)('User', UserSchema);
