"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Usermiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("./config");
const Usermiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            res.status(401).json({ error: 'Authorization header missing' });
            return;
        }
        // if (!authHeader.startsWith('Bearer ')) {
        //     res.status(401).json({ error: 'Invalid token format' });
        //     return;
        // }
        // const token = authHeader.split(' ')[1];
        try {
            const decoded = jsonwebtoken_1.default.verify(authHeader, config_1.JWT_SECRET);
            req.userId = decoded.id;
            next();
        }
        catch (jwtError) {
            res.status(401).json({ error: 'Invalid token' });
            return;
        }
    }
    catch (error) {
        res.status(500).json({ error: 'Internal server error' });
        return;
    }
};
exports.Usermiddleware = Usermiddleware;
