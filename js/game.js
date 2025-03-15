import { Map } from "./gameObjects/map.js";
import { Player } from "./gameObjects/player.js";
import { Companion } from "./gameObjects/companion.js";
import { Npcs } from "./gameObjects/npc's.js";
import { Pokemon } from "./gameObjects/pokemon.js";
import { createPokemonList } from "../js/backpack.js";


GetPokemon();
Npcs.createNpc(200, 300)
let pause = false;

addEventListener("keydown", (e) => {
  //   alert(e.keyCode);
  if (e.keyCode === 80) {
    pause = !pause;
  }
  if (!pause && !Player.isInEvent) {
    if (e.keyCode === 87 || e.keyCode === 38 /*w*/) {
      Player.moveUp();
    }
    if (e.keyCode === 65 || e.keyCode === 37 /*a*/) {
      Player.moveLeft();
    }
    if (e.keyCode === 83 || e.keyCode === 40 /*s*/) {
      Player.moveDown();
    }
    if (e.keyCode === 68 || e.keyCode === 39 /*d*/) {
      Player.moveRight();
    }
    if (e.keyCode === 79 /*o*/) {
      toggleDebug();
    }
    if (e.keyCode === 13 /*enter*/) {
      Player.interact();
    }
    if (e.keyCode === 32 /*space*/) {
    }
  }
});
const intervalId = setInterval(() => {
  if (!pause && !Player.isInEvent) {
    Player.update();
    Npcs.update();
    Map.update()
  };
  if (false) {
    clearInterval(intervalId);
  }
}, 45);

function toggleDebug() {
  Player.toggleDebug();
  Companion.toggleDebug();
}

async function GetPokemon() {
  const pokemonList = [];
  fetch("https://pokeapi.co/api/v2/pokemon?limit=51&offset=0")
    .then((result) => {
      return result.json();
    })
    .then((result) => {
      const pokemonData = result["results"];
      return pokemonData;
    })
    .then((result) => {
      return Promise.all(result.map((value) => fetch(value.url)));
    })
    .then((result) => {
      return Promise.all(result.map((value) => value.json()));
    })
    .then((result) => {
      result.forEach((pokemon) => {
        pokemonList.push({
          abilities: pokemon.abilities,
          base_experience: pokemon.base_experience,
          //cries: pokemon.cries,
          //forms: pokemon.forms,
          //game_indices: pokemon.game_indices,
          //height: pokemon.height,
          //held_items: pokemon.held_items,
          id: pokemon.id,
          is_default: pokemon.is_default,
          //location_area_encount: pokemon.location_area_encount,
          moves: pokemon.moves,
          name: pokemon.name,
          //order: pokemon.order,
          //past_abilities: pokemon.past_abilities,
          //past_types: pokemon.past_types,
          species: pokemon.species,
          sprites: pokemon.sprites,
          //other: pokemon.other,
          //versions: pokemon.versions,
          stats: [
            pokemon.stats[0],
            pokemon.stats[1],
            pokemon.stats[2],
            pokemon.stats[3],
            pokemon.stats[4],
            pokemon.stats[5],
            {
              base_stat: 0,
              effort: 0,
              stat: {
                name: "wins",
                url: "",
              }
            },
            {
              base_stat: 0,
              effort: 0,
              stat: {
                name: "losses",
                url: "",
              }
            },

          ],
          //types: pokemon.types,
          //weight: pokemon.weight,
          nickname: "",
          evolution_chain: [],
        });
      });
      console.log(pokemonList);
      //console.log(pokemonList.sort((a, b) => a.base_experience - b.base_experience))
      //als je ergens de pokemon nodig hebt stuur da hier als parameter door
      Player.getPokemon(pokemonList);
      Npcs.getPokemon(pokemonList);
      Pokemon.getPokemon(pokemonList);
      Pokemon.spawnPokemon();
      createPokemonList(pokemonList);
      getPokemonEvolutions(pokemonList);
    });

}
async function getPokemonEvolutions(pokemonList) {
  pokemonList.forEach(async (pokemon, index) => {
    const speciesResponse = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemon.name}`);
    const speciesData = await speciesResponse.json();

    const evolutionUrl = speciesData.evolution_chain.url;

    const evolutionResponse = await fetch(evolutionUrl);
    const evolutionData = await evolutionResponse.json();

    let evolutionChain = [];
    let chain = evolutionData.chain;

    while (chain) {
      evolutionChain.push(chain.species.name);
      chain = chain.evolves_to.length ? chain.evolves_to[0] : null;
    }
    for (let name of evolutionChain) {
      const pokemonMatch = pokemonList.find((value)=>{
        return value.name === name;
      })
      pokemonList[index].evolution_chain.push({
        name,
        sprite: pokemonMatch? pokemonMatch.sprites["front_default"] : "../images/pikachu_silouhette.png"}
      );

    }
  })
}
