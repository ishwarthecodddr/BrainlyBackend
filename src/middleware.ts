import { NextFunction,Request,Response } from 'express';
import jwt from 'jsonwebtoken'

import { JWT_SECRET } from './config';

export const  Usermiddleware=(req:Request,res:Response,next:NextFunction):void =>{
    const header = req.headers.authorization;
    const user = jwt.verify(header as string, JWT_SECRET);
    if (user) {
        // @ts-ignore
        req.userId = user.id;
    }
    next()
}