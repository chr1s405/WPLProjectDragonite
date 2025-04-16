import express, { Express } from "express";
import { MongoClient, ObjectId } from "mongodb";
import { getUser, userCollection } from "../database";
import { User } from "../interfaces";

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
    const collection = "Users";

    router.get("/", (req, res) => {
        const formError: FormError = {};
        res.render("login", { formError })
    })
    router.post("/", async (req, res) => {
        let username = req.body.username;
        let password = req.body.password;
        let formError: FormError = { username: username };
        if (username === "" || password === "") {
            formError.emptyField = true;
            res.render("login", { formError })
        }
        else {
            const user = await getUser({ username: username });
            if (user) {
                if (user.password === password) {
                    res.redirect("/game"); //this doesnt crash the app but still gives an error
                }
                else {
                    formError.wrongPassword = true;
                }
            }
            else {
                formError.wrongUser = true;
            }
            res.render("login", { formError })
        }

    })
    router.get("/signup", (req, res) => {
        const formError: FormError = {};
        res.render("signup", { formError });
    })
    router.post("/signup", async (req, res) => {
        let email = req.body.email;
        let username = req.body.username;
        let password = req.body.password;
        let formError: FormError = { username: username, email: email };
        if (username === "" || email === "" || password === "") {
            formError.emptyField = true;
            res.render("signup", { formError })
        }
        else {
            let user = await getUser({ username: username });
            if (!user) {
                userCollection.insertOne({ username, email, password });
                console.log(await userCollection.find().toArray());
                res.redirect("/login")
            }
            else {
                formError.wrongUser = true;
            }
        }
        res.render("signup", { formError });
    })
    router.get("/reset", (req, res) => {
        const formError: FormError = {};
        res.render("resetpassword", { formError });
    })
    router.post("/reset", (req, res) => {
        let email = req.body.email;
        let formError: FormError = { email: email };
        if (email === "") {
            formError.wrongEmail = true;
            res.render("resetpassword", { formError })
        }
        else {
            res.redirect("/login")
        }
    })
    return router;
}