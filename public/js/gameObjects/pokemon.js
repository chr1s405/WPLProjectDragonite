// import { Map } from "./map.js";
// import { Player } from "./player.js";

import { allPokemon, createSimplePokemon, findPokemon } from "../game.js";

const pokemonDiv = document.createElement("div");
pokemonDiv.setAttribute("class", "pokemon");
pokemonDiv.style.display = "none";

export function createPokemon(map) {
    const wildPokemon = {
        type: "pokemon",
        div: pokemonDiv,
        x: 0,
        y: 0,
        width: 50,
        height: 50,
        speed: 10,
        isScared: false,
        isActive: false,
        pokemon: undefined,
        spawnTimer: 0,
        spawnTime: 100,
        scareTimer: 0,
        scareTime: 10,
        scareRadius: 200,

        update,
        move,
        spawn,
    }
    map.addObject(wildPokemon);
    return wildPokemon
}
function update(map, player) {
    if (this.isActive) {
        this.move(map, player)
        this.div.style.left = `${this.x}px`;
        this.div.style.top = `${this.y}px`;
        this.div.style.display = "block";
    }
    else {
        this.spawn(map);
        this.div.style.display = "none";
    }
}
function move(map, player) {
    const distX = (player.x + player.width / 2) - (this.x + this.width / 2);
    const distY = (player.y + player.height / 2) - (this.y + this.height / 2);
    let distSum = Math.abs(distX) + Math.abs(distY);
    distSum = distSum === 0 ? 1 : distSum;
    if (!this.isScared) {
        const dist = Math.sqrt(Math.pow(distX, 2) + Math.pow(distY, 2));
        if (dist > this.scareRadius) {
            this.x += (distX / distSum) * this.speed;
            this.y += (distY / distSum) * this.speed;
        }
        else {
            this.isScared = true;
        }
    }
    else {
        if (this.scareTimer < this.scareTime) {
            this.scareTimer++;
        }
        else {
            this.x += (distX / distSum) * -this.speed;
            this.y += (distY / distSum) * -this.speed;
            if (!map.isOnScreen(this.x, this.y, this.width, this.height)) {
                this.x = 0;
                this.y = 0;
                this.isScared = false;
                this.scareTimer = 0;
                this.isActive = false;
            }
        }
    }
    // map.handleCollision(this);
}
function spawn(map) {
    this.spawnTimer++;
    if (this.spawnTimer > this.spawnTime) {
        this.spawnTimer = 0;
        const spawnPos = map.getPositionOffScreen();
        this.x = spawnPos.x;
        this.y = spawnPos.y;
        this.pokemon = createSimplePokemon(allPokemon[Math.trunc(Math.random() * allPokemon.length)].id);
        this.div.style.backgroundImage = `url("${findPokemon(this.pokemon.id).sprites["front_default"]}")`;
        this.isActive = true;
    }
}
