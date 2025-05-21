import express from "express";
import { allPokemon, createGame, getNpcs, getPlayer, getpokemon, resetGame, setNpcs, setPlayer } from "../database";

export function getGameRouter() {
    const router = express.Router();


    router.get("", async (req, res) => {
        const userId = typeof req.query.user === "string" ? parseInt(req.query.user) : -1;
        const player = await getPlayer(userId);
        if (player) {
            return res.render("game", { userId });
        }
        else {
            return res.redirect(`/pokemon/game/intro?user=${userId}`);
        }
    })

    router.get("/intro", (req, res) => {
        let starterPokemon = allPokemon.slice(0,3).map((pokemon)=>{
            return {name: pokemon.name, img: pokemon.sprites.front_default}
        });
        let starterCharacters =  ["Red","Leaf","Lucas","Dawn","Calem","Serena",]
        return res.render("gameIntro", {starterPokemon, starterCharacters});
    })
    router.post("/intro", async (req, res) => {
        const userId = typeof req.query.user === "string" ? parseInt(req.query.user) : -1;
        await createGame(userId);
        await setPlayer(userId, req.body);
        return res.json({ redirect: `./?user=${userId}` });
    })
    router.post("/load", async (req, res) => {
        const userId = typeof req.query.user === "string" ? parseInt(req.query.user) : -1;
        const gameData: any = {};
        gameData.player = await getPlayer(userId);
        gameData.npcs = await getNpcs(userId);
        return res.json(gameData);
    })
    router.post("/save", async (req, res) => {
        const userId = typeof req.query.user === "string" ? parseInt(req.query.user) : -1;
        const player = req.body.player;
        const npcs = req.body.npcs;
        await setPlayer(userId, player);
        await setNpcs(userId, npcs)
        
        res.json({ succes: true });
    })
    router.post("/reset", async (req, res) => {
        const userId = typeof req.query.user === "string" ? parseInt(req.query.user) : -1;
        await resetGame(userId);
        res.json({ succes: true, path: `/pokemon/game` });
    })
    router.post("/logout", (req, res)=>{
        res.json({path: "/pokemon/account"})
    })
    router.post("/getPokemon", async (req, res)=>{
        res.json(await getpokemon());
    })

    return router;
}