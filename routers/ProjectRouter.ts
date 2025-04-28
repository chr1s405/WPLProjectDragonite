import express, { Express } from "express";
export let link: string = "#";



export function getProjectRouter() {
    const router = express.Router();

    const projects = [{
        background: "/assets/backgrounds/mtg_background.jpeg",
        logo: "/assets/logos/mtg_logo.jpeg",
        logoBgColor: "rgba(100, 100, 100, 0.7)",
        link: "#",
    },
    {
        background: "/assets/backgrounds/lego_background.jpeg",
        logo: "/assets/logos/lego_logo.jpeg",
        logoBgColor: "rgba(100, 100, 100, 0.7)",
        link: "#",
    },
    {
        background: "/assets/backgrounds/lotr_background.jpeg",
        logo: "/assets/logos/lotr_logo.jpeg",
        logoBgColor: "rgba(100, 100, 100, 0.7)",
        link: "#",
    },
    {
        background: "/assets/backgrounds/fortnite_background.jpeg",
        logo: "/assets/logos/fortnite_logo.jpeg",
        logoBgColor: "rgba(100, 100, 100, 0.7)",
        link: "#",
    },
    {
        background: "/assets/backgrounds/fifa_background.jpg",
        logo: "/assets/logos/fifa_logo.jpeg",
        logoBgColor: "rgba(100, 100, 100, 0.7)",
        link: "#",
    },
    {
        background: "/assets/backgrounds/pokemon_background.jpeg",
        logo: "/assets/logos/pokemon_logo.jpeg",
        logoBgColor: "rgba(100, 100, 100, 0.7)",
        link: "pokemon/account/",
    }
    ]

    router.get("", (req, res) => {
        const idx = typeof req.query.projectIdx === "string" ? parseInt(req.query.projectIdx) : 0;
        res.render("index", { projects, idx });
    })

    return router;
}
