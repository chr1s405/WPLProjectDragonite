import express, { Express } from "express";

export function getGameRouter(){
    const router = express.Router();


    router.get("", (req,res)=>{
        res.send("game")
    })
    return router;
}