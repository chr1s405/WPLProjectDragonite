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
        npc.assignPokemon(pokemonList[Math.trunc(Math.random() * pokemonList.length)]);
      }
    });
  },
  createNpc(x, y) {
    const npcDiv = document.createElement("div");
    npcDiv.setAttribute("class", "npc");
    npcDiv.style.left = `${x}px`;
    npcDiv.style.top = `${y}px`;
    npcDiv.style.backgroundImage = `url(${`../../images/characters/trainer_${Math.trunc(Math.random()*5+1)}.png`})`;
    //npcDiv.setAttribute("style", `left: ${x}px; top: ${y}px; background`);
    Map.div?.appendChild(npcDiv);

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
        this.pokemon = Object.assign({}, pokemon);
        this.pokemon.is_captured = true;
      },
    };
    Npcs.npcList.push(npc);
  },
};