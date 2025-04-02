import express, { Express } from "express";

export function GetAccountRouter(){
    const router = express.Router();

    router.get("login", (req,res)=>{
        res.render("login");
    })
    router.get("signup", (req,res)=>{
        res.render("signup");
    })
    router.get("reset", (req,res)=>{
        res.render("reset");
    })
    return router;
}