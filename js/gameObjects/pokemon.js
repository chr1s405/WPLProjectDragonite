import { Map } from "./map.js";

let pokemonList;
const pokemonDiv = document.createElement("div");
Map.div?.appendChild(pokemonDiv);
pokemonDiv.setAttribute("class", "pokemon");

export const Pokemon = {
    div: pokemonDiv,
    x: 0,
    y: 0,
    width: pokemonDiv.clientWidth,
    height: pokemonDiv.clientHeight,
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
            this.pokemon = pokemonList[Math.trunc(Math.random() * pokemonList.length)];
            this.div.setAttribute("style", 
                `display: block;
                 left: ${pos.x}px; top: ${pos.y}px; 
                 background-image: Url(${this.pokemon.sprites["front_default"]});`);
            this.isActive = true;
            setTimeout(() => {
                this.div.style.display = "none";
                this.isActive = false;
            }, 10000);
        },30000)

    }
};