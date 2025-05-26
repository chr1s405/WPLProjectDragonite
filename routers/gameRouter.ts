import express from "express";
import { allPokemon, createGame, getNpcs, getPlayer, getpokemon, resetGame, setNpcs, setPlayer } from "../database";

export function getGameRouter() {
    const router = express.Router();


    router.get("", async (req, res) => {
        const userId = res.locals.user.id;
        const player = await getPlayer(userId);
        if (player) {
            return res.render("game", { userId });
        }
        else {
            return res.redirect(`/pokemon/game/intro`);
        }
    })

    router.get("/intro", (req, res) => {
        let starterPokemon: any = [];
        let usedIdx: number[] = [];
        for (let i = 0; i < 3; i++) {
            let pokemonIdx = -1;
            while (usedIdx.includes(pokemonIdx) || pokemonIdx === -1) {
                pokemonIdx = Math.round(Math.random() * allPokemon.length -1);
            }
            usedIdx.push(pokemonIdx);
            starterPokemon.push({name: allPokemon[pokemonIdx].name, img: allPokemon[pokemonIdx].sprites.front_default})
        }
        let starterCharacters = ["Red", "Leaf", "Lucas", "Dawn", "Calem", "Serena",]
        return res.render("gameIntro", { starterPokemon, starterCharacters });
    })
    router.post("/intro", async (req, res) => {
        const userId = res.locals.user.id;
        await createGame(userId);
        await setPlayer(userId, req.body);
        return res.json({ redirect: `./` });
    })
    router.post("/load", async (req, res) => {
        const userId = res.locals.user.id;
        const gameData: any = {};
        gameData.player = await getPlayer(userId);
        gameData.npcs = await getNpcs(userId);
        return res.json(gameData);
    })
    router.post("/save", async (req, res) => {
        const userId = res.locals.user.id;
        const player = req.body.player;
        const npcs = req.body.npcs;
        await setPlayer(userId, player);
        await setNpcs(userId, npcs)

        res.json({ succes: true });
    })
    router.post("/reset", async (req, res) => {
        const userId = res.locals.user.id;
        await resetGame(userId);
        res.json({ succes: true, path: `/pokemon/game` });
    })
    router.post("/logout", (req, res) => {
        res.clearCookie("jwt");
        res.json({ path: "/pokemon/" })
    })
    router.post("/getPokemon", async (req, res) => {
        res.json(await getpokemon());
    })

    return router;
}