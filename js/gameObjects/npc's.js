import { Map } from "./map.js";
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
        assignPokemon(pokemon){
            this.pokemon = pokemon;
        }
    }
]
npcs.forEach((npc) => {
    createNpc(npc);
})

function createNpc(npc) {
    const npcDiv = document.createElement("div");
    npcDiv.setAttribute("class", "npc");
    npcDiv.setAttribute("style", `left: ${npc.x}px; top: ${npc.y}px;`);
    Map.div?.appendChild(npcDiv);
    
    npc.width = npcDiv.clientWidth;
    npc.height = npcDiv.clientHeight;
}