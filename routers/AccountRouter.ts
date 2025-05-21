import express from "express";
import { login, signup } from "../database";
import * as jwt from 'jsonwebtoken';

export function GetAccountRouter() {

    const router = express.Router();

    router.get("", (req, res) => {
        return res.redirect("login");
    })
    router.get("/login", (req, res) => {
        return res.render("login")
    })
    router.post("/login", async (req, res) => {
        let username = req.body.username;
        let password = req.body.password;
        try {
            const user = await login(username, password);
            delete user.password;
            const token = jwt.sign(user, process.env.JWT_TOKEN!, { expiresIn: "7d" });
            res.cookie("jwt", token, { httpOnly: true, sameSite: "lax", secure: false });
            res.locals.user = user;
            return res.redirect("./game")
        } catch (err) {
            if (err instanceof Error) {
                console.log(err)
                res.cookie("accountError", err.message)
            }
            return res.redirect("./login");
        }
    })
    router.get("/signup", (req, res) => {
        return res.render("signup");
    })
    router.post("/signup", async (req, res) => {
        let email = req.body.email;
        let username = req.body.username;
        let password = req.body.password;
        try {
            await signup(username, email, password);
        } catch (err) {
            if (err instanceof Error) {
                res.cookie("accountError", err.message)
            }
            return res.redirect("./signup");
        }
        return res.redirect("./login");
    })
    router.get("/reset", (req, res) => {
        return res.render("resetpassword");
    })
    router.post("/reset", (req, res) => {
        let email = req.body.email;
        if (email === "") {
            res.cookie("accountError", "Vul alle velden in")
            return res.redirect("./reset")
        }
        else {
            return res.redirect("./login")
        }
    })
    return router;
}