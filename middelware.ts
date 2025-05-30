import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
export function secureMiddleware(req: Request, res: Response, next: NextFunction) {
    const token: string | undefined = req.cookies?.jwt;
    if (!token) {
        return res.redirect("/pokemon/login");
    }
    jwt.verify(token, process.env.JWT_TOKEN!, (err, user) => {
        if (err) {
            return res.redirect("/pokemon/login");
        } else {
            res.locals.user = user;
            return next();
        }
    });
};
export function skipLogin(req: Request, res: Response, next: NextFunction) {
    const token: string | undefined = req.cookies?.jwt;
    if (!token) {
        return next();
    }
    jwt.verify(token, process.env.JWT_TOKEN!, (err, user) => {
        if (err) {
            return next();
        } else {
            res.locals.user = user;
            return res.redirect("/pokemon/game");
        }
    });
}

export function showAccountError(req: Request, res: Response, next: NextFunction) {
    const accountError = req.cookies.accountError
    if (accountError) {
        res.clearCookie("accountError");
        res.locals.accountError = accountError;
    }
    else {
        res.locals.accountError = undefined;
    }
    next();
}