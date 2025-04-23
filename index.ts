import express, { Express } from "express";
import dotenv from "dotenv";
import path from "path";
import { getGameRouter } from "./routers/gameRouter";
import { GetAccountRouter } from "./routers/AccountRouter";
import { getProjectRouter } from "./routers/ProjectRouter";
import { connect } from "./database";

dotenv.config();

const app: Express = express();

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "views"));

app.set("port", process.env.PORT ?? 3000);

app.get("/", (req, res) => {
    res.render("index")
});



app.use("/", getProjectRouter());
app.use("/login", GetAccountRouter());
app.use("/game", getGameRouter());
app.use(express.static("public"));
app.listen(app.get("port"), async () => {
    await connect();
    console.log("Server started on http://localhost:" + app.get("port"));
});