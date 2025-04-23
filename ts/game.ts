import { createMap } from "./gameObjects/map.ts";
import { createPlayer } from "./gameObjects/player.ts";
import { createNpc } from "./gameObjects/npc's.ts";
import { createPokemon } from "./gameObjects/pokemon.ts";
import { createBackpack } from "./gameObjects/backpack.ts";
import { Backpack, Map, Player, Pokemon } from "../interfaces.ts";

let pause = true;

export let allPokemon: any[];
export let backpack: any;
let map: any;
let player: any;

play();

async function play() {
  allPokemon = await GetPokemon();
  await gameInit();
  await gameLoop();
}

async function gameInit() {
  map = createMap();
  player = createPlayer();
  createNpc(map, 200, 300);
  createNpc(map, 700, 250);
  createNpc(map, 300, 1050);
  createNpc(map, 700, 750);
  createNpc(map, 950, 550);
  createPokemon(map);
  backpack = createBackpack(player);

  await intro();
  // document.getElementById("overworldMap").style.display = "block";
  const backpackIcon: any = document.getElementById("backpackIcon");
  backpackIcon.style.display = "block";

  addEventListener("keydown", (e) => {
    //   alert(e.keyCode);
    if (e.keyCode === 80) {
      pause = !pause;
    }
    if (!pause && !player.isInEvent) {
      if (e.keyCode === 87 || e.keyCode === 38 /*w*/) {
        player.moveUp(true);
      }
      if (e.keyCode === 65 || e.keyCode === 37 /*a*/) {
        player.moveLeft(true);
      }
      if (e.keyCode === 83 || e.keyCode === 40 /*s*/) {
        player.moveDown(true);
      }
      if (e.keyCode === 68 || e.keyCode === 39 /*d*/) {
        player.moveRight(true);
      }
      if (e.keyCode === 79 /*o*/) {
        toggleDebug();
      }
      if (e.keyCode === 73 /*i*/) {

      }
      if (e.keyCode === 13 /*enter*/) {
        player.interact(map);
      }
      if (e.keyCode === 32 /*space*/) {
      }
    }
  });
  addEventListener("keyup", (e) => {
    if (e.keyCode === 87 || e.keyCode === 38 /*w*/) {
      player.moveUp(false);
    }
    if (e.keyCode === 65 || e.keyCode === 37 /*a*/) {
      player.moveLeft(false);
    }
    if (e.keyCode === 83 || e.keyCode === 40 /*s*/) {
      player.moveDown(false);
    }
    if (e.keyCode === 68 || e.keyCode === 39 /*d*/) {
      player.moveRight(false);
    }
  })
}
async function intro() {
  const introPage: any = document.getElementById("gameIntro");
  let optionsDiv;
  optionsDiv = introPage.getElementsByClassName("intro_selection")[0];
  const starterCharacters = [
    // { name: "man", img: "../../assets/characters/player1Sprites.png" },
    { name: "Red", img: "../../assets/characters/Red.png" },
    { name: "Leaf", img: "../../assets/characters/leaf.png" },
    { name: "Lucas", img: "../../assets/characters/lucas.webp" },
    { name: "Dawn", img: "../../assets/characters/dawn.png" },
    { name: "Calem", img: "../../assets/characters/calem.png" },
    { name: "Serena", img: "../../assets/characters/serena.png" }
  ]

  createIntroOptions(optionsDiv, starterCharacters)
  let playerIndex: any = await getIntroSelection(optionsDiv);
  player.div.style.backgroundImage = `url(${starterCharacters[playerIndex].img})`;
  optionsDiv = introPage.getElementsByClassName("intro_selection")[1];
  const starterPokemon = allPokemon.slice(0, 3).map((pokemon) => {
    return { name: pokemon.name, img: pokemon.sprites["front_default"] };
  });

  createIntroOptions(optionsDiv, starterPokemon)
  optionsDiv.style.display = "block";
  let pokemonIndex: any = await getIntroSelection(optionsDiv);
  optionsDiv.style.display = "none";
  player.capturePokemon(allPokemon[pokemonIndex]);
  player.setCompanion(allPokemon[pokemonIndex]);
  setTimeout(() => {
    const alert = document.getElementById("alert");
    if (alert != null) { alert.click() }
  }, 1);
  introPage.style.display = "none"
}

function createIntroOptions(optionsDiv: any, optionsList: { name: string, img: string }[] = []) {
  const options = optionsDiv.getElementsByClassName("intro_selectOptions")[0];
  optionsList.forEach((option: any) => {
    const div = document.createElement("div");
    div.classList.add("intro_selectOption")
    const img = document.createElement("img");
    img.src = option.img;
    const p = document.createElement("p");
    p.innerHTML = option.name;

    div.appendChild(img);
    div.appendChild(p);
    options.appendChild(div);
  });
}

async function getIntroSelection(optionsDiv: any) {
  optionsDiv.style.display = "block";
  const options = optionsDiv.getElementsByClassName("intro_selectOption");
  return new Promise((resolve, reject) => {

    for (let i = 0; i < options.length; i++) {

      options[i].addEventListener("click", () => {
        resolve(i);
        optionsDiv.style.display = "none";
        optionsDiv.replaceWith(optionsDiv.cloneNode(true));
        //om eventlistener te removen
      })
    };
  })
}

function gameLoop() {
  const intervalId = setInterval(() => {
    if (!pause && !player.isInEvent) {
      map.update(player);
      player.update(map);
    };
    if (false) {
      clearInterval(intervalId);
    }
  }, 45);
}

export async function setTextBox(textbox: any, text: string) {
  let i = 0;
  const textBoxText = textbox.getElementsByTagName("p")[0];
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      document.addEventListener("click", () => { i = text.length }, { once: true });
    }, 10);
    const intervalId = setInterval(() => {
      if (i < text.length) {
        i++;
        textBoxText.innerHTML = text.substring(0, i);
      }
      else {
        textBoxText.innerHTML = text;
        clearInterval(intervalId);
        textbox.getElementsByTagName("p")[1].style.display = "block";
        document.addEventListener("click", () => {
          textBoxText.innerHTML = "";
          textbox.getElementsByTagName("p")[1].style.display = "none";
          resolve(true);
        }, { once: true });
      }
    }, 30);
  })
}
export async function setAlert(message: string) {
  const alert: any = document.getElementById("alert");
  return new Promise((resolve, reject) => {
    pause = true;
    alert.style.display = "block";
    alert.getElementsByTagName("p")[0].innerHTML = message;
    setTimeout(() => {
      alert.addEventListener("click", () => {
        pause = false;
        alert.style.display = "none";
        resolve(true);
      }, { once: true });
    }, 1);
  })
};

async function GetPokemon() {
  let pokemonList: Pokemon[] = [];
  let pokemonFetch: any = await fetch("https://pokeapi.co/api/v2/pokemon?limit=10&offset=0")
  let pokemonJson = await pokemonFetch.json();
  let pokemonData = pokemonJson["results"];
  pokemonFetch = await Promise.all(pokemonData.map((value: any) => fetch(value.url)));
  pokemonJson = await Promise.all(pokemonFetch.map((value: any) => value.json()));
  pokemonJson.forEach((pokemon: any) => {
    pokemonList.push({
      abilities: pokemon.abilities,
      base_experience: pokemon.base_experience,
      cries: pokemon.cries,
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
        pokemon.stats[0], //hp
        pokemon.stats[1], //atk
        pokemon.stats[2], //def
        pokemon.stats[3], //spAtk
        pokemon.stats[4], //spDef
        pokemon.stats[5], //speed
        {          //[6]
          base_stat: 0,
          effort: 0,
          stat: {
            name: "wins",
            url: "",
          }
        },
        {          //[7]
          base_stat: 0,
          effort: 0,
          stat: {
            name: "losses",
            url: "",
          }
        },

      ],
      types: pokemon.types,
      //weight: pokemon.weight,
      nickname: "???",
      evolution_chain: [],
      isKnown: false,
      isCaptured: false,
    });
  });
  console.log(pokemonList);
  console.log(pokemonList.sort((a, b) => a.base_experience - b.base_experience))
  //als je ergens de pokemon nodig hebt stuur da hier als parameter door
  // Player.getPokemon(pokemonList);
  // Npcs.getPokemon(pokemonList);
  // Pokemon.getPokemon(pokemonList);
  // Pokemon.spawnPokemon();
  // getPokemon(pokemonList); // backpack.ts
  getPokemonEvolutions(pokemonList);
  return pokemonList;

}
async function getPokemonEvolutions(pokemonList: Pokemon[]) {
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
      const pokemonMatch = pokemonList.find((value) => {
        return value.name === name;
      })
      pokemonList[index].evolution_chain.push({
        name,
        sprite: pokemonMatch ? pokemonMatch.sprites["front_default"] : "../assets/pikachu_silouhette.png"
      }
      );

    }
  })
}

function toggleDebug() {
  player.toggleDebug();
}