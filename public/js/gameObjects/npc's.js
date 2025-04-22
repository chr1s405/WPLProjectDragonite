import { allPokemon } from "../game.js";

let pokemonList;
export function createNpc(map, x, y) {
  const npcDiv = document.createElement("div");
  npcDiv.setAttribute("class", "npc");
  npcDiv.style.left = `${x}px`;
  npcDiv.style.top = `${y}px`;
  npcDiv.style.backgroundImage = `url(${`../../assets/characters/trainer_${Math.trunc(Math.random() * 5 + 1)}.png`})`;

  const npc = {
    type: "npc",
    div: npcDiv,
    x: x,
    y: y,
    width: 50, //gets calculated in map.addObject()
    height: 50,
    speed: 10,
    velocityX: 0,
    velocityY: 0,
    direction: "down",
    spriteIndex: 0,
    path: [],
    isMoving: false,
    isOnScreen: false,
    pokemon: undefined,

    update,
    assignPokemon,
    move,
    goTo,
  };
  map.addObject(npc);
  npc.assignPokemon(allPokemon[Math.trunc(Math.random() * allPokemon.length)]);
  return npc;
}
function update(map) {
  if(Math.trunc(Math.random() * 1000) === 1){
    const dest = map.getRandomPosition(this.x, this.y, 1000);
    this.goTo(map, map.positionInGrid(dest.x, dest.y));
  }
  this.move(map);
  this.div.style.left = `${this.x}px`;
  this.div.style.top = `${this.y}px`;
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
function goTo(map, dest) {
  if (this.path.length === 0) {
    this.path = map.findPath(map.positionInGrid(this.x, this.y), dest);
  }
}
function move(map) {
  if (this.path.length > 0) {
    let pos = map.positionInWorld(this.path[0]);
    if (this.y > pos.y) { this.y -= Math.min(this.speed, Math.abs(pos.y - this.y)); };
    if (this.y < pos.y) { this.y += Math.min(this.speed, Math.abs(pos.y - this.y)); };
    if (this.x > pos.x) { this.x -= Math.min(this.speed, Math.abs(pos.x - this.x)); };
    if (this.x < pos.x) { this.x += Math.min(this.speed, Math.abs(pos.x - this.x)); };

    if (pos.x === this.x && pos.y === this.y) {
      this.path.splice(0,1)
    };
  }
}
