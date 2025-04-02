import { allPokemon } from "../game.js";

let pokemonList;
export function createNpc(map, x, y) {
  const npcDiv = document.createElement("div");
  npcDiv.setAttribute("class", "npc");
  npcDiv.style.left = `${x}px`;
  npcDiv.style.top = `${y}px`;
  npcDiv.style.backgroundImage = `url(${`../../images/characters/trainer_${Math.trunc(Math.random() * 5 + 1)}.png`})`;

  const npc = {
    type: "npc",
    div: npcDiv,
    x: x,
    y: y,
    width: 50, //gets calculated in map.addObject()
    height: 50,
    isOnScreen: false,
    pokemon: undefined,

    update,
    assignPokemon,
  };
  map.addObject(npc);
  npc.assignPokemon(allPokemon[Math.trunc(Math.random() * allPokemon.length)]);
  return npc;
}
function update(map) {
  if (this.isOnScreen !== map.isOnScreen(this.x, this.y, this.width, this.height)) {
    this.isOnScreen = !this.isOnScreen;
  }
  if (this.isOnScreen) {
  }
}
function assignPokemon(pokemon) {
  this.pokemon = Object.assign({}, pokemon);
  this.pokemon.isCaptured = true;
}
// export const Npcs = {
//   npcList: [],
//   npcsActive: [],

//   update() {
//     this.npcList.forEach((npc) => {
//       npc.update();
//     });
//   },
//   getPokemon(allPokemon){
//     pokemonList = allPokemon;
//   },
//   ,
// };