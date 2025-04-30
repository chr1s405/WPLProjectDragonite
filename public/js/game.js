import { createMap } from "./gameObjects/map.js";
import { createPlayer } from "./gameObjects/player.js";
import { createNpc } from "./gameObjects/npc's.js";
import { createPokemon } from "./gameObjects/pokemon.js";
import { createBackpack } from "./gameObjects/backpack.js";

let pause = true;
export let allPokemon;
export let backpack;

let map;
let player;

allPokemon = await GetPokemon();
await gameInit();
await gameLoop();

async function gameInit() {
  map = createMap();
  player = createPlayer(450,450);
  createNpc(map, 200, 300);
  createNpc(map, 700, 250);
  createNpc(map, 300, 1050);
  createNpc(map, 700, 750);
  createNpc(map, 950, 550);
  createPokemon(map);
  backpack = createBackpack(player);

  await intro();
  // document.getElementById("overworldMap").style.display = "block";
  document.getElementById("backpackIcon").style.display = "block";

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
  const introPage = document.getElementById("gameIntro");
  let optionsDiv;
  optionsDiv = introPage.getElementsByClassName("intro_selection")[0];
  const starterCharacters = [
    // { name: "man", img: "../../assets/characters/player1Sprites.png" },
    { name: "Red", smallImg: "../../assets/characters/Red.png", img: "../../assets/characters/RedBig.webp" },
    { name: "Leaf", smallImg: "../../assets/characters/leaf.png", img: "../../assets/characters/LeafBig.png" },
    { name: "Lucas", smallImg: "../../assets/characters/lucas.webp", img: "../../assets/characters/LucasBig.webp" },
    { name: "Dawn", smallImg: "../../assets/characters/dawn.png", img: "../../assets/characters/DawnBig.webp" },
    { name: "Calem", smallImg: "../../assets/characters/calem.png", img: "../../assets/characters/CalemBig.webp" },
    { name: "Serena", smallImg: "../../assets/characters/serena.png", img: "../../assets/characters/SerenaBig.png" }
  ]

  createIntroOptions(optionsDiv, starterCharacters)
  let playerIndex = await getIntroSelection(optionsDiv);
  player.div.style.backgroundImage = `url(${starterCharacters[playerIndex].smallImg})`;
  optionsDiv = introPage.getElementsByClassName("intro_selection")[1];
  const starterPokemon = allPokemon.slice(0, 3).map((pokemon) => {
    return { name: pokemon.name, img: pokemon.sprites["front_default"] };
  });

  createIntroOptions(optionsDiv, starterPokemon)
  optionsDiv.style.display = "block";
  let pokemonIndex = await getIntroSelection(optionsDiv);
  optionsDiv.style.display = "none";
  player.capturePokemon(allPokemon[pokemonIndex]);
  player.setCompanion(allPokemon[pokemonIndex]);
  setTimeout(() => { document.getElementById("alert").click() }, 1);
  introPage.style.display = "none"
}

function createIntroOptions(optionsDiv, optionsList = undefined) {
  const options = optionsDiv.getElementsByClassName("intro_selectOptions")[0];
  optionsList.forEach((option) => {
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

async function getIntroSelection(optionsDiv) {
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

export async function setTextBox(text, name = "") {
  const textbox = document.getElementById("textBox");
  const textboxName = document.getElementById("textBoxName");
  const textBoxText = document.getElementById("textBoxMsg");
  const continueText = textbox.getElementsByTagName("p")[textbox.getElementsByTagName("p").length-1];
  textbox.style.display = "block";
  textboxName.innerHTML = name;
  pause = true;
  let i = 0;
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
        continueText.style.display = "block";
        document.addEventListener("click", () => {
          textBoxText.innerHTML = "";
          continueText.style.display = "none";
          textbox.style.display = "none";
          pause = false;
          resolve(true);
        }, { once: true });
      }
    }, 30);
  })
}
export async function setAlert(message) {
  const alert = document.getElementById("alert");
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
  let pokemonList = [];
  let pokemonFetch = await fetch("https://pokeapi.co/api/v2/pokemon?limit=10&offset=0")
  let pokemonJson = await pokemonFetch.json();
  let pokemonData = pokemonJson["results"];
  pokemonFetch = await Promise.all(pokemonData.map((value) => fetch(value.url)));
  pokemonJson = await Promise.all(pokemonFetch.map((value) => value.json()));
  pokemonJson.forEach((pokemon) => {
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
      nickname: "",
      evolution_chain: [],
      isKnown: false,
    });
  });
  console.log(pokemonList);
  console.log(pokemonList.sort((a, b) => a.base_experience - b.base_experience))
  //als je ergens de pokemon nodig hebt stuur da hier als parameter door
  // Player.getPokemon(pokemonList);
  // Npcs.getPokemon(pokemonList);
  // Pokemon.getPokemon(pokemonList);
  // Pokemon.spawnPokemon();
  // getPokemon(pokemonList); // backpack.js
  getPokemonEvolutions(pokemonList);
  return pokemonList;

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
