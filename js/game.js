import { Map } from "./gameObjects/map.js";
import { Player } from "./gameObjects/player.js";
import { Companion } from "./gameObjects/companion.js";
import { Npcs } from "./gameObjects/npc's.js";
import { Pokemon } from "./gameObjects/pokemon.js";


GetPokemon();
Npcs.createNpc(200, 300)
let pause = false;

addEventListener("keydown", (e) => {
  //   alert(e.keyCode);
  if (e.keyCode === 80) {
    pause = !pause;
  }
  if (!pause && !Player.isInEvent) {
    if (e.keyCode === 87 /*w*/) {
      Player.moveUp();
    }
    if (e.keyCode === 65 /*a*/) {
      Player.moveLeft();
    }
    if (e.keyCode === 83 /*s*/) {
      Player.moveDown();
    }
    if (e.keyCode === 68 /*d*/) {
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
  fetch("https://pokeapi.co/api/v2/pokemon?limit=50&offset=0")
    .then((result) => {
      return result.json();
    })
    .then((result) => {
      const pokemonData = result["results"];
      return pokemonData;
    })
    .then((result) => {
      return Promise.all(result.map((result) => fetch(result.url)));
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
          //species: pokemon.species,
          sprites: pokemon.sprites,
          //other: pokemon.other,
          //versions: pokemon.versions,
          stats: pokemon.stats,
          //types: pokemon.types,
          //weight: pokemon.weight,
        });
      });
      //console.log(pokemonList.sort((a, b) => a.base_experience - b.base_experience))
      //als je ergens de pokemon nodig hebt stuur da hier als parameter door
      Player.getPokemon(pokemonList);
      Npcs.getPokemon(pokemonList);
      Pokemon.getPokemon(pokemonList);
      Pokemon.spawnPokemon()

    });
    
  }
