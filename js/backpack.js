import { Player } from "./gameObjects/player.js";

let allPokemon;
export function getPokemon(pokemonList) {
  allPokemon = pokemonList;

  const filters = pokedexMenuEvent.getElementsByClassName("pokedex_filter");
  const filterText = filters[0];
  const table = pokedexMenuEvent.getElementsByClassName("pokemon_list")[0].getElementsByTagName("table")[0];
  filterText.addEventListener("input", () => { updatePokemonList(table, pokedexRowClick) });
  const filterCaught = filters[1];
  filterCaught.addEventListener("change", () => { updatePokemonList(table, pokedexRowClick) });
  const filterType = filters[2];
  filterType.addEventListener("change", () => { updatePokemonList(table, pokedexRowClick) });
  const sortOption = filters[3];
  sortOption.addEventListener("change", () => { updatePokemonList(table, pokedexRowClick) });
}

const backpackIcon = document.getElementById("backpackIcon");
const backpackMenu = document.getElementById("backpackMenu")
const backpackMenuItems = document.getElementsByClassName("backpackMenuBtn");
const pokedexMenuEvent = document.getElementById("menu_pokedex");
const pokedexDetailMenuEvent = document.getElementById("menu_pokemonDetail");
const compareMenuEvent = document.getElementById("menu_compare");
const whosThatMenuEvent = document.getElementById("menu_whosThat");
const battleMenuEvent = document.getElementById("menu_battle");
const captureMenuEvent = document.getElementById("menu_capture");
//const menuEvents = document.getElementsByClassName("menuEvent");
const menuEvents = [
  { event: pokedexMenuEvent, open: openPokedexEvent, close: closePokedexEvent },
  { event: pokedexDetailMenuEvent, open: openDetailEvent, close: closeDetailsEvent },
  { event: compareMenuEvent, open: openCompareEvent, close: closeCompareEvent },
  { event: whosThatMenuEvent, open: openWhosThatEvent, close: closeWhosThatEvent },
  { event: battleMenuEvent, open: openBattleEvent, close: closeBattleEvent },
  { event: captureMenuEvent, open: openCaptureEvent, close: closeCaptureEvent },
  { event: backpackMenu, open: openMenu, close: closeMenu },
]
let previousMenu = [];
let currentMenu;


backpackIcon.addEventListener("click", (e) => {
  openMenu();
})
for (let i = 0; i < backpackMenuItems.length - 1; i++) {
  backpackMenuItems[i].addEventListener("click", (e) => {
    menuEvents[i].open();
    backpackMenu.style.display = "none"
    previousMenu.push(menuEvents[menuEvents.length - 1]);
  });
}
menuEvents.forEach((menuEvent) => {
  menuEvent.event.getElementsByClassName("closeBtn")[0].addEventListener("click", (e) => {
    closeAllEvents();
  });
  if (menuEvent.event.getElementsByClassName("backBtn")[0]) {
    menuEvent.event.getElementsByClassName("backBtn")[0].addEventListener("click", (e) => {
      backbuttonPressed(menuEvent);
    });
  }
})


function closeAllEvents() {
  closeMenu();
  menuEvents.forEach((menuEvent) => {
    if (menuEvent.event.style.display === "block") {
      menuEvent.close();
    }
  });
  previousMenu = [];
  Player.isInEvent = false;
}
function backbuttonPressed() {
  currentMenu.close();
  previousMenu[previousMenu.length - 1].open();
  previousMenu.pop();
}


function openMenu() {
  Player.isInEvent = true;
  backpackIcon.style.display = "none";
  backpackMenu.style.display = "block";
  currentMenu = backpackMenu;
}
function closeMenu(event = undefined) {
  backpackIcon.style.display = "block";
  backpackMenu.style.display = "none";
  if (event !== undefined) {
    event.style.display = "none";
  }
}


// ========= pokedex ======== //
function openPokedexEvent() {
  Player.isInEvent = true;
  pokedexMenuEvent.style.display = "block"
  currentMenu = menuEvents.find(menuEvent => menuEvent.event === pokedexMenuEvent);
  const table = pokedexMenuEvent.getElementsByClassName("pokemon_list")[0].getElementsByTagName("table")[0];
  resetFilters();
  createPokemonList(table, getFilteredList(table), pokedexRowClick);
}
function closePokedexEvent() {
  pokedexMenuEvent.style.display = "none"
}

function getFilteredList(table) {
  let filteredList = allPokemon;
  const filters = table.parentElement.getElementsByClassName("pokedex_filter");
  if (filters.length > 0) {
    const filterText = filters[0];
    const sortOption = filters[1];
    const filterCaught = filters[2];
    const filterKnown = filters[3];
    const filterType = filters[4];

    filteredList = filteredList.filter((pokemon) => {
      const matchesSearch = pokemon.name.toLowerCase().includes(filterText.value.toLowerCase());
      const isCaught = Player.capturedPokemon.includes(pokemon);
      const isKnown = pokemon.is_known;
      const isType = filterType.value === "all" || pokemon.types.some(t => t.type.name === filterType.value);
      return matchesSearch && (!filterCaught.checked || isCaught) && (!filterKnown.checked || isKnown) && isType;
    });
    filteredList.sort((a, b) => {
      if (sortOption.value === "id") {
        return a.id - b.id;
      } else if (sortOption.value === "hp") {
        return b.stats[0].base_stat - a.stats[0].base_stat; // HP
      } else if (sortOption.value === "attack") {
        return b.stats[1].base_stat - a.stats[1].base_stat; // Aanval
      } else if (sortOption.value === "speed") {
        return b.stats[5].base_stat - a.stats[5].base_stat; // Snelheid
      }
      return 0;
    });
  }
  return filteredList;
}
function resetFilters() {
  const filters = document.getElementsByClassName("pokedex_filter");
  filters[0].value = "";
  filters[1].value = "id";
  filters[2].checked = false;
  filters[3].value = "all";
}
function createPokemonList(table, pokemonList, rowFunction) {
  table.innerHTML = "";
  pokemonList.forEach(pokemon => {
    const tableRow = document.createElement("tr");
    tableRow.setAttribute("class", "tableRow");

    const pokemonImg = document.createElement("img");
    pokemonImg.setAttribute("class", "tableImg");
    pokemonImg.src = pokemon.sprites["front_default"];
    pokemonImg.style.filter = pokemon.is_known ? "brightness(100%)" : "brightness(0%)";

    const pokemonInfo = document.createElement("p");
    pokemonInfo.setAttribute("class", "tableInfo");
    pokemonInfo.innerHTML = `#${pokemon.id}</br>${pokemon.is_known ? pokemon.name : "???"}`;

    table.appendChild(tableRow);
    tableRow.appendChild(pokemonImg);
    tableRow.appendChild(pokemonInfo);
    tableRow.addEventListener("click", () => {
      if (pokemon.is_known) {
        rowFunction(pokemon);
      }
      else {
        previousMenu.push(currentMenu);
        currentMenu.close();
        openWhosThatEvent(pokemon);
      }
    });
  })
}
function updatePokemonList(table, rowFunction) {
  createPokemonList(table, getFilteredList(table), rowFunction);
}
function pokedexRowClick(pokemon) {
  currentMenu.close();
  previousMenu.push(currentMenu)
  openDetailEvent(pokemon);
}
function compareLeftRowClick(pokemon) {
  const compareSide = compareMenuEvent.getElementsByClassName("compare_sides")[0];
  openCompareSide(compareSide, pokemon);
}
function compareRightRowClick(pokemon) {
  const compareSide = compareMenuEvent.getElementsByClassName("compare_sides")[1];
  openCompareSide(compareSide, pokemon);
}

// ========= pokedex detail ======== //
function openDetailEvent(pokemon) {
  Player.isInEvent = true;
  pokedexDetailMenuEvent.style.display = "block";
  currentMenu = menuEvents.find(menuEvent => menuEvent.event === pokedexDetailMenuEvent);
  if (!pokemon) {
    return;
  }
  const pokedexDetails = document.getElementById("pokedex_detail");
  const statsDiv = pokedexDetails.children[0];
  const stats = statsDiv.getElementsByTagName("p");
  for (let i = 0; i < stats.length; i++) {
    const text = stats[i].innerHTML;
    stats[i].innerHTML = text.substring(0, text.indexOf(':') + 1) + ` ${pokemon.stats[(stats.length - 2 + i) % stats.length].base_stat}`
  }
  const pokemonDiv = pokedexDetails.children[1];
  pokemonDiv.getElementsByTagName("p")[0].innerHTML = pokemon.is_known ? pokemon.name : "???";
  pokemonDiv.getElementsByTagName("img")[0].src = pokemon.sprites["front_default"];
  pokemonDiv.getElementsByTagName("img")[0].style.filter = pokemon.is_known ? "brightness(100%)" : "brightness(0%)";
  const buttonsDiv = pokedexDetails.children[2];
  const buttons = buttonsDiv.getElementsByTagName("button");
  buttons[0].replaceWith(buttons[0].cloneNode(true));
  buttons[0].addEventListener("click", () => {
    Player.setCompanion(pokemon);
  })
  buttons[1].replaceWith(buttons[1].cloneNode(true));
  buttons[1].addEventListener("click", () => {
    Player.releasePokemon(pokemon);
  })
  buttons[2].replaceWith(buttons[2].cloneNode(true));
  buttons[2].addEventListener("click", () => {
    closeDetailsEvent();
    const compareSide = compareMenuEvent.getElementsByClassName("compare_sides")[0];
    openCompareSide(compareSide, pokemon);
    openCompareEvent();
    previousMenu.push(menuEvents.find((menuEvent) => { return menuEvent.event === pokedexDetailMenuEvent }));
  })
  const evolutionDiv = pokedexDetails.children[3];
  const evolutionSteps = evolutionDiv.getElementsByClassName("pokedex_evolutionStep");
  const evolutionArrows = evolutionDiv.getElementsByClassName("pokedex_evolutionArrow");
  for (let i = 0; i < evolutionSteps.length; i++) {
    evolutionSteps[i].style.display = "none";
    if (i > 0) {
      evolutionArrows[i - 1].style.display = "none";
    }
  }
  for (let i = 0; i < pokemon.evolution_chain.length; i++) {
    const evolutionPokemon = allPokemon.find((value) => { return value.name === pokemon.evolution_chain[i].name });
    const isKnown = evolutionPokemon ? (evolutionPokemon.is_known) : false;
    evolutionSteps[i].children[1].innerHTML = isKnown ? pokemon.evolution_chain[i].name : "???";
    evolutionSteps[i].children[0].src = pokemon.evolution_chain[i].sprite;
    evolutionSteps[i].children[0].style.filter = isKnown ? "brightness(100%)" : "brightness(0%)";
    evolutionSteps[i].style.display = "block";
    if (i > 0) {
      evolutionArrows[i - 1].style.display = "block";
    }
  }
}
function closeDetailsEvent() {
  pokedexDetailMenuEvent.style.display = "none"
}

// ========= compare ======== //
function openCompareEvent() {
  Player.isInEvent = true;
  compareMenuEvent.style.display = "block";
  currentMenu = menuEvents.find(menuEvent => menuEvent.event === compareMenuEvent);
  const tableLeft = compareMenuEvent.getElementsByClassName("pokemon_list")[0];
  const tableRight = compareMenuEvent.getElementsByClassName("pokemon_list")[1];
  resetFilters();
  createPokemonList(tableLeft, getFilteredList(compareMenuEvent), compareLeftRowClick);
  createPokemonList(tableRight, getFilteredList(compareMenuEvent), compareRightRowClick);
}
function closeCompareEvent() {
  const compareSides = compareMenuEvent.getElementsByClassName("compare_sides");
  const tables = compareMenuEvent.getElementsByClassName("pokemon_list");
  for (let i = 0; i < compareSides.length; i++) {
    tables[i].style.display = "block";
    compareSides[i].style.display = "none";
  }
  compareMenuEvent.style.display = "none"
}
function openCompareSide(compareSide, pokemon) {
  compareSide.getElementsByTagName("img")[0].src = pokemon.sprites["front_default"];
  compareSide.getElementsByTagName("p")[0].innerHTML = pokemon.name;
  const statsDiv = compareSide.getElementsByTagName("div")[0];
  const stats = statsDiv.getElementsByTagName("span");
  for (let i = 0; i < stats.length; i++) {
    let text = `${pokemon.stats[i].base_stat}`;
    stats[i].innerHTML = text;
    stats[i].setAttribute("class", "");
    stats[i].setAttribute("class", "");
  }
  compareSide.style.display = "block";
  compareSide.parentElement.getElementsByClassName("pokemon_list")[0].style.display = "none";
  updateComparePage();
}
function updateComparePage() {
  let isBothChosen = true;
  const sides = compareMenuEvent.getElementsByClassName("compare_sides");
  for (let i = 0; i < sides.length; i++) {
    if (sides[i].style.display !== "block") {
      isBothChosen = false;
    }
  }
  if (isBothChosen) {
    const statsDivLeft = compareMenuEvent.getElementsByClassName("compare_sides")[0].getElementsByTagName("div")[0];
    const statsLeft = statsDivLeft.getElementsByTagName("span");
    const statsDivRight = compareMenuEvent.getElementsByClassName("compare_sides")[1].getElementsByTagName("div")[0];
    const statsRight = statsDivRight.getElementsByTagName("span");
    for (let i = 0; i < statsLeft.length; i++) {
      let textLeft = statsLeft[i].innerHTML.match(/\d+/g)[0];
      let textRight = statsRight[i].innerHTML.match(/\d+/g)[0];
      const difference = textLeft - textRight;
      if (difference !== 0) {
        textLeft += ` ${difference < 0 ? "-" : "+"}${Math.abs(difference)}`
        textRight += ` ${difference < 0 ? "+" : "-"}${Math.abs(difference)}`
        statsLeft[i].setAttribute("class", difference < 0 ? "redText" : "greenText");
        statsRight[i].setAttribute("class", difference < 0 ? "greenText" : "redText");
      }
      else {

        statsLeft[i].setAttribute("class", "");
        statsRight[i].setAttribute("class", "");
      }
      statsLeft[i].innerHTML = textLeft;
      statsRight[i].innerHTML = textRight;
    }
  }
}
const reselectBtns = compareMenuEvent.getElementsByClassName("compare_reselect");
for (let i = 0; i < reselectBtns.length; i++) {
  reselectBtns[i].addEventListener("click", () => {
    const compareSides = compareMenuEvent.getElementsByClassName("compare_sides");
    const tables = compareMenuEvent.getElementsByClassName("pokemon_list");
    tables[i].style.display = "block";
    compareSides[i].style.display = "none";
  })
}

// ========= who's that pokemon ======== //
function openWhosThatEvent(pokemon) {
  Player.isInEvent = true;
  whosThatMenuEvent.style.display = "block";
  currentMenu = menuEvents.find(menuEvent => menuEvent.event === whosThatMenuEvent);

  const whosThatDiv = document.getElementById("whosThat_main");
  const img = whosThatDiv.getElementsByTagName("img")[0];
  const name = whosThatDiv.getElementsByTagName("p")[0];
  const input = whosThatDiv.getElementsByTagName("input")[0];
  const button = whosThatDiv.getElementsByTagName("button")[0];
  img.src = pokemon.sprites["front_default"];
  img.style.filter = "brightness(0%)";
  name.innerHTML = "???";
  input.value = "";
  input.style.display = "block";
  button.innerHTML = "confirm"
  button.addEventListener("click", () => {
    if (button.innerHTML === "confirm") {
      if (input.value === pokemon.name) {
        pokemon.is_known = true;
        img.style.filter = "brightness(100%)";
        name.innerHTML = pokemon.name;
        input.style.display = "none";
        button.style.display = "none"
        button.replaceWith(button.cloneNode(true));
      }
      else{
        alert("dat is niet de juiste pokemon");
      }
    }
  });
}
function closeWhosThatEvent() {
  whosThatMenuEvent.style.display = "none";
}



// ========= battle ======== //
export function openBattleEvent() {
  Player.isInEvent = true;
  battleMenuEvent.style.display = "block";
  currentMenu = menuEvents.find(menuEvent => menuEvent.event === battleMenuEvent);
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

// ========= capture ======== //
export function openCaptureEvent() {
  Player.isInEvent = true;
  captureMenuEvent.style.display = "block"
  currentMenu = menuEvents.find(menuEvent => menuEvent.event === captureMenuEvent);
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
