import { Map } from "./map.js";
import { Player } from "./player.js";

let pokemonList;
const pokemonDiv = document.createElement("div");
pokemonDiv.setAttribute("class", "pokemon");

export const Pokemon = {
    div: pokemonDiv,
    x: 0,
    y: 0,
    width: 50,
    height: 50,
    isActive: false,
    pokemon: undefined,

    update() {
        if (this.isRendered) {
        }
    },
    getPokemon(allPokemon) {
        pokemonList = allPokemon;
    },
    spawnPokemon() {
        setInterval(() => {
            const pos = Map.getPositionOnScreen();
            this.x = pos.x;
            this.y = pos.y;
            this.pokemon = pokemonList[Math.trunc(Math.random() * pokemonList.length)];
            this.div.style.display = "block";
            this.div.style.left = `${pos.x}px`;
            this.div.style.top = `${pos.y}px`;
            this.div.style.backgroundImage = `url(${this.pokemon.sprites["front_default"]})`
            this.isActive = true;
            setTimeout(() => {
                this.div.style.display = "none";
                this.isActive = false;
            }, 10000);
        },15000)

    }
};