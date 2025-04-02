import express, { Express } from "express";

export function getGameRouter(){
    const router = express.Router();


    router.get("", (req,res)=>{
        res.render("game")
    })
    return router;
}