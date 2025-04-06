import express, { Express } from "express";
import { MongoClient, ObjectId } from "mongodb";

export function GetAccountRouter(db: MongoClient, database: string) {
    interface FormError {
        emptyField?: boolean,
        wrongUser?: boolean,
        wrongEmail?: boolean,
        wrongPassword?: boolean,
        username?: string,
        email?: string,
    }
    interface User {
        _id?: ObjectId
        username: string,
        email: string,
        password: string,
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
            try {
                await db.connect();
                const user: User | null = await db.db(database).collection(collection).findOne<User>({ username: username });
                if (user) {
                    if (user.password === password) {
                        res.redirect("/game"); //this doesnt crash the app but gives an error
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
            catch (error) {
                console.log(error)
            }
            finally {
                await db.close();
            }
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
            try {
                await db.connect();
                let user: User | null = await db.db(database).collection(collection).findOne<User>({ username: username });
                if (!user) {
                    user = { username, email, password }
                    db.db(database).collection(collection).insertOne(user);
                    console.log(await db.db(database).collection(collection).find().toArray());
                    res.redirect("/login")
                }
                else {
                    formError.wrongUser = true;
                }
            }
            catch (error) {
                console.log(error)
            }
            finally {
                await db.close();
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
        else{
            res.redirect("/login")
        }
    })
    return router;
}