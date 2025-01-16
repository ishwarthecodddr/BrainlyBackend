"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Usermiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("./config");
const Usermiddleware = (req, res, next) => {
    const header = req.headers.authorization;
    const user = jsonwebtoken_1.default.verify(header, config_1.JWT_SECRET);
    if (user) {
        // @ts-ignore
        req.userId = user.id;
    }
    next();
};
exports.Usermiddleware = Usermiddleware;
