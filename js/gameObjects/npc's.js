import { pokemon } from "../api.js"
import { Map } from "./map.js";
setTimeout(()=>{
    
},5000);
const npcs = [
    {
        x: 4 * Map.tilewidth,
        y: 6 * Map.tileHeight,
        width: 0,
        height: 0,
        hasPokemon: false,
        pokemon: undefined,

        update(){
            if(!this.hasPokemon){
                this.assignPokemon()
            }
        },
        createNpc() {
            const npc = document.createElement("div");
            npc.setAttribute("class", "npc");
            npc.setAttribute("style", `width: ${this.width}px`);
            npc.setAttribute("style", `height: ${this.height}px`);
            Map.div?.appendChild(npc);
        },
        assignPokemon(){
            this.pokemon = pokemon[Math.random() % pokemon.length];
        }
    }
]
npcs.forEach((npc) => {
    npc.width = 50;
    npc.height = 50;
    npc.CreateNpc();
})


