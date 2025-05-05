import express, { Express } from "express";
import { createGame, getUser, loadGame, userCollection } from "../database";

export function GetAccountRouter() {
    interface FormError {
        emptyField?: boolean,
        wrongUser?: boolean,
        wrongEmail?: boolean,
        wrongPassword?: boolean,
        username?: string,
        email?: string,
    }

    const router = express.Router();

    router.get("", (req, res) => {
        const formError: FormError = {};
        return res.redirect("./login");
    })
    router.get("/login", (req, res) => {
        const formError: FormError = {};
        return res.render("login", { formError })
    })
    router.post("/login", async (req, res) => {
        let username = req.body.username;
        let password = req.body.password;
        let formError: FormError = { username: username };
        if (username === "" || password === "") {
            formError.emptyField = true;
            return res.render("login", { formError })
        }
        else {
            const user = await getUser(username);
            if (user) {
                if (user.password === password) {
                    await loadGame(username);
                    return res.redirect("/pokemon/game");
                }
                else {
                    formError.wrongPassword = true;
                }
            }
            else {
                formError.wrongUser = true;
            }
            return res.render("login", { formError })
        }

    })
    router.get("/signup", (req, res) => {
        const formError: FormError = {};
        return res.render("signup", { formError });
    })
    router.post("/signup", async (req, res) => {
        let email = req.body.email;
        let username = req.body.username;
        let password = req.body.password;
        let formError: FormError = { username: username, email: email };
        if (username === "" || email === "" || password === "") {
            formError.emptyField = true;
            return res.render("signup", { formError })
        }
        else {
            let user = await getUser(username);
            if (!user) {
                userCollection.insertOne({ username, email, password });
                createGame(username);
                return res.redirect("./login")
            }
            else {
                formError.wrongUser = true;
            }
        }
        return res.render("signup", { formError });
    })
    router.get("/reset", (req, res) => {
        const formError: FormError = {};
        return res.render("resetpassword", { formError });
    })
    router.post("/reset", (req, res) => {
        let email = req.body.email;
        let formError: FormError = { email: email };
        if (email === "") {
            formError.wrongEmail = true;
            return res.render("resetpassword", { formError })
        }
        else {
            return res.redirect("./login")
        }
    })
    return router;
}