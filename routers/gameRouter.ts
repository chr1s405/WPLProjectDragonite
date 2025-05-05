import express from "express";
import { createGame, gameCollection, getGame, loadGame, resetGame, saveGame } from "../database";
import fs from "fs";
import path from "path";

export function getGameRouter() {
    const router = express.Router();


    router.get("", async (req, res) => {
        try {
            const data = await fs.promises.readFile(path.join(__dirname, "../public/js/gameData.json"), 'utf8')
            const firstLogin = JSON.parse(data).firstLogin;
            if (firstLogin) {
                return res.redirect("./game/intro")
            }
        }
        catch (error) {
            console.log("error reading file: " + error)
        }
        return res.render("game");
    })

    router.get("/intro", (req, res) => {
        return res.render("gameIntro");
    })
    router.post("/intro", async (req, res) => {
        try {
            const filePath = path.join(__dirname, "../public/js/gameData.json");
            const jsonFile = await fs.promises.readFile(filePath, "utf8");
            let gameData = JSON.parse(jsonFile);

            gameData.firstLogin = false;
            gameData.player.sprite = req.body.characterSprite;

            await fs.promises.writeFile(filePath, JSON.stringify(gameData, null, 2));
        }
        catch (err) {
            console.log(err);
        }
        return res.json({ redirect: "./" });
    })

    router.post("/save", async (req, res) => {
        console.log("save data")
        const saveData = req.body;
        let username: string;
        try {
            const data = await fs.promises.readFile(path.join(__dirname, "../public/js/gameData.json"), 'utf8')
            username = JSON.parse(data).username;
            saveGame(username, saveData);
            res.json({ succes: true });
        }
        catch (error) {
            console.log("error reading file: " + error);
            res.json({ succes: false, error: error });
        }
    })

    return router;
}