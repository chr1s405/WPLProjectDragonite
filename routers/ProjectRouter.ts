import express, { Express } from "express";




export function getProjectRouter(){
    const router = express.Router();

    router.get("", (req,res)=>{
        res.send("index")
    })
    return router;
}