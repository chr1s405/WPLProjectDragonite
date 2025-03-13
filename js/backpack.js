import { Player } from "./gameObjects/player.js";


const backpackIcon = document.getElementById("backpackIcon");
const backpackMenu = document.getElementById("backpackMenu")
const backpackCloseBtn = document.getElementById("backpackMenuCloseBtn");
const backpackMenuItems = document.getElementsByClassName("backpackMenuBtn");
const menuEvents = document.getElementsByClassName("menuEvent");
const pokedexMenuEvent = document.getElementById("menu_pokedex");
// const whosThatMenuEvent = document.getElementById("menu_who'sThat");
const battleMenuEvent = document.getElementById("menu_battle");
const captureMenuEvent = document.getElementById("menu_capture");


backpackIcon.addEventListener("click", (e) => {
  openMenu();
})
backpackCloseBtn.addEventListener("click", (e) => {
  closeMenu();
})

for (let i = 0; i < backpackMenuItems.length - 1; i++) {
  backpackMenuItems[i].addEventListener("click", (e) => {
    openEvent(menuEvents[i]);
  });

  menuEvents[i].getElementsByClassName("closeBtn")[0].addEventListener("click", (e) => {
    closeMenu(menuEvents[i]);
  })
}
battleMenuEvent.getElementsByClassName("closeBtn")[0].addEventListener("click", (e) => {
  closeBattleEvent();
  Player.isInEvent = false;
})
captureMenuEvent.getElementsByClassName("closeBtn")[0].addEventListener("click", (e) => {
  closeCaptureEvent();
  Player.isInEvent = false;
})

function openMenu() {
  backpackIcon.style.display = "none";
  backpackMenu.style.display = "grid";
}
function openEvent(event) {
  backpackMenu.style.display = "none"
  event.style.display = "block";
}
function closeMenu(event = undefined) {
  backpackIcon.style.display = "block";
  backpackMenu.style.display = "none";
  if (event !== undefined) {
    event.style.display = "none";
  }
}

export function openBattleEvent(){
  battleMenuEvent.style.display = "grid";
  const stages = document.getElementsByClassName("battle_stage");
  const stage = [];
  for (let i = 0; i < stages.length; i++) {
    stage.push({
      img: stages[i].children[1],
      name: stages[i].getElementsByClassName("statusbar")[0].children[0],
      hpBar: stages[i].getElementsByClassName("statusbar")[0].children[1],
      hp: stages[i].getElementsByClassName("statusbar")[0].children[1].children[0],
    })
  }
  return stage;
}
export function closeBattleEvent() {
  battleMenuEvent.style.display = "none"
  closeMenu();
}

export function openCaptureEvent() {
  captureMenuEvent.style.display = "block"
  const element = document.getElementById("capture_main");
  const stage = {
   name: element.children[0],
   img: element.children[1],
   button: element.children[2],
   chances: document.getElementById("capture_chances"),
  }
  return stage;
}
export function closeCaptureEvent() {
  captureMenuEvent.style.display = "none";
  closeMenu();
}

export function createPokemonList(allPokemon){
  const table = pokedexMenuEvent.getElementsByTagName("table")[0];
  allPokemon.forEach(pokemon => {
    const tableRow = document.createElement("tr");
    tableRow.setAttribute("class", "tableRow");
    const pokemonImg = document.createElement("img");
    pokemonImg.setAttribute("class", "tableImg");
    pokemonImg.src = pokemon.sprites["front_default"]
    const pokemonInfo = document.createElement("p");
    pokemonInfo.setAttribute("class", "tableInfo");
    pokemonInfo.innerHTML = `nr. ${pokemon.id}</br>${pokemon.name}`

    table.appendChild(tableRow);
    tableRow.appendChild(pokemonImg);
    tableRow.appendChild(pokemonInfo);
  });
  console.log(table);
}