import express, { Express } from "express";
import { createGame, gameCollection, getGame, loadGame, resetGame, saveGame } from "../database";
import fs from "fs";
import path from "path";

export function getGameRouter() {
    const router = express.Router();


    router.get("", async (req, res) => {
        // fs.readFile(path.join(__dirname, "../public/js/gameData.json"),'utf8', async (err,data)=>{
        //     if(err){console.log("error reading file: " + err)}
        //     const gameData = JSON.parse(data);
        //     res.render("game");
        // })
        res.render("game");
    })
    router.post("/save", async (req, res) => {
        console.log("save data")
        const saveData = req.body;
        let username: string;
        try {
            const data = await fs.promises.readFile(path.join(__dirname, "../public/js/gameData.json"), 'utf8')
            username = JSON.parse(data).username;
            saveGame(username, saveData);
        }
        catch (error) {
            console.log("error reading file: " + error)
        }
        res.redirect("./")
    })
    router.get("/intro", (req,res)=>{
        
        res.render("intro");
    })
    return router;
}