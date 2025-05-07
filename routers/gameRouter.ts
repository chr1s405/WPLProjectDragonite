import express from "express";
import { createGame, deleteGame, gameCollection, getGame, getGameData, loadGame, saveGame, setGameData, updateGameData } from "../database";
import fs from "fs";
import path from "path";

export function getGameRouter() {
    const router = express.Router();


    router.get("", async (req, res) => {
        let gameData = await getGameData();
        if (await getGame(gameData.username)) {
            await loadGame(gameData.username);
            return res.render("game");
        }
        else {
            return res.redirect("./game/intro")
        }
    })

    router.get("/intro", (req, res) => {
        return res.render("gameIntro");
    })
    router.post("/intro", async (req, res) => {

        let gameData = await getGameData();
        try {
            await createGame(gameData.username);
            gameData["player.sprite"] = req.body.playerSprite;
            gameData["player.characterImg"] = req.body.characterImg;
            gameData["player.starterPokemon"] = req.body.starterPokemon;
            console.log(req.body);
            await saveGame(gameData.username, gameData)
            return res.json({ redirect: "./" });
        }
        catch (err) {
            console.log(err)
            setGameData({ username: gameData.username })
            return res.json({ redirect: "./intro" });
        }
    })

    router.post("/save", async (req, res) => {
        console.log("save data")
        const saveData = req.body;
        await saveGame((await getGameData()).username, saveData);
        res.json({ succes: true });
    })
    router.post("/reset", async (req, res) => {
        console.log("delete data");
        const gameData = await getGameData();
        await deleteGame(gameData.username);
        res.json({succes: true, redirect: "/pokemon/game"});
    })

    return router;
}