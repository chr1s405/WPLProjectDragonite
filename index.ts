import express, { Express } from "express";
import dotenv from "dotenv";
import path from "path";
import { getGameRouter } from "./routers/gameRouter";
import { GetAccountRouter } from "./routers/AccountRouter";
import { getProjectRouter } from "./routers/ProjectRouter";
import { connect } from "./database";
import cookieParser from "cookie-parser";
import { secureMiddleware, showAccountError } from "./middelware";

dotenv.config();

const app: Express = express();

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());
app.set("views", path.join(__dirname, "views"));

app.set("port", process.env.PORT ?? 3000);

app.use("/", getProjectRouter());
app.use("/pokemon/",showAccountError, GetAccountRouter());
app.use("/pokemon/game/", secureMiddleware, getGameRouter());

app.use(express.static("public"));
app.listen(app.get("port"), async () => {
    await connect();
    console.log("Server started on http://localhost:" + app.get("port"));
});


