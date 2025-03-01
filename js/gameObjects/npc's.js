import { Map } from "./map.js";
export const Npcs = {
  npcList: [],

  update() {
    this.npcList.forEach((npc) => {
      npc.update();
    });
  },
  assignPokemon(pokemonList) {
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
        this.isRendered = Map.isOnScreen(this.x, this.y, this.width, this.height)
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