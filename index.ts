import express, { Express } from "express";
import dotenv from "dotenv";
import path from "path";
import { getGameRouter } from "./routers/gameRouter";
import { GetAccountRouter } from "./routers/AccountRouter";
import { getProjectRouter } from "./routers/ProjectRouter";
import { connect } from "./database";
import { projectPicture } from "./interfaces";
import { cursorTo } from "readline";
import { UnorderedBulkOperation } from "mongodb";

dotenv.config();

const app: Express = express();

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "views"));

app.set("port", process.env.PORT ?? 3000);

export const projectImages: projectPicture[] = [{
     background:"/assets/backgrounds/mtg_background.jpeg",
     logo: "/assets/logos/mtg_logo.jpeg",
     logoBgColor: "rgba(7, 5, 5, 0.8)"},
     {
        background: "/assets/backgrounds/lego_background.jpeg",
        logo: "/assets/logos/lego_logo.jpeg",
        logoBgColor: "rgba(100, 100, 100, 0.8)"
     },
     {
        background: "/assets/backgrounds/lotr_background.jpeg",
         logo: "/assets/logos/lotr_logo.jpeg", 
         logoBgColor: "rgba(100, 100, 100, 0.8)"
     },
      { background: "/assets/backgrounds/fortnite_background.jpeg", 
        logo: "/assets/logos/fortnite_logo.jpeg", 
        logoBgColor: "rgba(100, 100, 100, 0.8)" 
    },
    { background: "/assets/backgrounds/fifa_background.jpg", 
        logo: "/assets/logos/fifa_logo.jpeg", 
        logoBgColor: "rgba(100, 100, 100, 0.8)" },
        { 
        background: "/assets/backgrounds/pokemon_background.jpeg", 
        logo: "/assets/logos/pokemon_logo.jpeg", 
        logoBgColor: "rgba(100, 100, 100, 0.8)" }
    ]

export const projectBackgrounds: string[]= [
"projectBtnMtg",
"projectBtnLego",
"projectBtnLotr",
"projectBtnfortnite",
"projectBtnFifa",
"projectBtnPokemon"
]

let currentProjectSelected: number = 0;

function changeCurrentProject(project: number){
currentProjectSelected = project
}

let link = "#"
  
app.post("/Arrowbtns", (req,res)=>{
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
     res.render("index" ,    {
        linktTologin: "#",
        projectBtn: projectImages[currentProjectSelected].logo,
        currentBackground: projectBackgrounds[currentProjectSelected]
    })
})


app.post("/Projectchoice", (req, res) =>{
if(req.body.smallbton === "mtg"){
    changeCurrentProject(0)
    link = "#"
 }
if(req.body.smallbton === "lego"){
changeCurrentProject(1)
link = "#"
}
if (req.body.smallbton === "lotr"){
changeCurrentProject(2)
link = "#"
}

if (req.body.smallbton === "fortnite"){
changeCurrentProject(3)
link = "#"
}

if (req.body.smallbton === "fifa"){
changeCurrentProject(4)
link = "#"
}

if (req.body.smallbton === "pokemon"){
changeCurrentProject(5)
link = "login"
}
res.render("index" ,    {
linktTologin: link,
projectBtn: projectImages[currentProjectSelected].logo,
currentBackground: projectBackgrounds[currentProjectSelected]
})
})


app.get("login", (req, res) =>{
res.render("login", {})
}
)

app.get("/", (req, res) => {
  
res.render("index", 
        {
            linktTologin: "#",
            projectBtn: projectImages[currentProjectSelected].logo,
            currentBackground: projectBackgrounds[currentProjectSelected]
    })
});


app.use("/", getProjectRouter());
app.use("/login", GetAccountRouter());
app.use("/game", getGameRouter());
app.use(express.static("public"));
app.listen(app.get("port"), async () => {
    await connect();
    console.log("Server started on http://localhost:" + app.get("port"));
});

