import express, { Express } from "express";
export let link: string = "#";
import { projectImages } from "..";
import { projectBackgrounds } from "..";

export let currentProjectSelected: number = 0;

export function changeCurrentProject(project: number){
currentProjectSelected = project
}

export function getProjectRouter(){
    const router = express.Router();

    // router.post("/Arrowbtns", (req,res)=>{
    //     if(req.body.arrowbton === "arrowLeft")
    //         {
    //             if (currentProjectSelected != 0){
    //             currentProjectSelected--
    //             }
    //             if(currentProjectSelected === 0){
    //                 currentProjectSelected = 5
    //             }
    //             if (currentProjectSelected === 5){
    //                 link = "login"
    //             }
    //         }
        
    //         if(req.body.arrowbton === "arrowRight")
    //             {
    //                 if (currentProjectSelected != 5){
    //                 currentProjectSelected++
    //                 }
    //                 if (currentProjectSelected === 5){
    //                     link = "login"
    //                     currentProjectSelected = 0
    //                 }
    //             }
    //     res.render("index" ,    {
    //                 linktTologin: "#",
    //                 projectBtn: projectImages[currentProjectSelected].logo,
    //                 currentBackground: projectBackgrounds[currentProjectSelected]
    //         })
    //     })

    router.post("/Arrowbtns", (req,res)=>{
        if(req.body.arrowbton === "arrowLeft")
            {
                if (currentProjectSelected != 0){
                currentProjectSelected--
                }
                if(currentProjectSelected === 0){
                    currentProjectSelected = 5
                }
                if (currentProjectSelected === 5){
                    link = "login"
                }
            }
        
            if(req.body.arrowbton === "arrowRight")
                {
                    if (currentProjectSelected != 5){
                    currentProjectSelected++
                    }
                    if (currentProjectSelected === 5){
                        link = "login"
                        currentProjectSelected = 0
                    }
                }
        res.send(projectImages[currentProjectSelected].logo)
        })



    router.post("/Projectchoice", (req, res) =>{
    if(req.body.smallbton === "mtg"){
        currentProjectSelected = 0
        link = "#"
     }
if(req.body.smallbton === "lego"){
    currentProjectSelected = 1
    link = "#"
 }
 if (req.body.smallbton === "lotr"){
currentProjectSelected = 2
 link = "#"
 }

 if (req.body.smallbton === "fortnite"){
    currentProjectSelected = 3
    link = "#"
    }

if (req.body.smallbton === "fifa"){
    currentProjectSelected = 4
    link = "#"
 }

 if (req.body.smallbton === "pokemon"){
    currentProjectSelected = 5
    link = "login"
 }
 res.render("index" ,    {
    linktTologin: "#",
    projectBtn: projectImages[currentProjectSelected].logo,
    currentBackground: projectBackgrounds[currentProjectSelected]
})
})
    return router;
}