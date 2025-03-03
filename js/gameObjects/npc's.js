import { Map } from "./map.js";

let pokemonList;
export const Npcs = {
  npcList: [],
  npcsActive: [],

  update() {
    this.npcList.forEach((npc) => {
      npc.update();
    });
  },
  getPokemon(allPokemon){
    pokemonList = allPokemon;
    this.assignPokemon();
  },
  assignPokemon() {
    this.npcList.forEach((npc) => {
      if (npc.pokemon === undefined) {
        npc.pokemon = pokemonList[Math.trunc(Math.random() * pokemonList.length)];
      }
    });
  },
  createNpc(x, y) {
    const npcDiv = document.createElement("div");
    Map.div?.appendChild(npcDiv);
    npcDiv.setAttribute("class", "npc");
    npcDiv.setAttribute("style", `left: ${x}px; top: ${y}px;`);

    const npc = {
      div: npcDiv,
      x: x,
      y: y,
      width: npcDiv.clientWidth,
      height: npcDiv.clientHeight,
      isRendered: false,
      pokemon: undefined,

      update() {
        if(this.isRendered !== Map.isOnScreen(this.x, this.y, this.width, this.height)){
          this.isRendered = !this.isRendered;
          if(this.isRendered){
            Npcs.npcsActive.push(this)
          }
          else{
            const index = Npcs.npcsActive.indexOf(this)
            if(index >= 0){
              Npcs.npcsActive.splice(index,1)
            }
          }
        }
        if (this.isRendered) {
        }
      },
      assignPokemon(pokemon) {
        this.pokemon = pokemon;
      },
    };
    Npcs.npcList.push(npc);
  },
};