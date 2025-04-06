import { allPokemon } from "../game.js";

export function createBackpack(player) {
  const backpack = {
    player: player,
    backpackIcon: document.getElementById("backpackIcon"),
    backpackBtns: document.getElementsByClassName("backpackMenuBtn"),
    backpackMenu: document.getElementById("backpackContents"),
    previousMenu: [],
    currentMenu: undefined,

    openMenu, //open the menu (sreen that displays all menu's)
    closeMenu,

    openEvent, //general (all openEvents call this)
    closeAllEvents,
    backbuttonPressed,

    openMainMenu, //menu with initial buttons

    openCompareSide,
    createPokemonList,

    openBattleEvent,
    closeBattleEvent,

    openCaptureEvent,
    closeCaptureEvent,
  }
  backpack.menuEvents = [
    { event: document.getElementById("menu_pokedex"), title: "pokedex", open: openPokedexEvent.bind(backpack), close: closePokedexEvent.bind(backpack) },
    { event: document.getElementById("menu_pokemonDetail"), title: "stats", open: openDetailEvent.bind(backpack), close: closeDetailsEvent.bind(backpack) },
    { event: document.getElementById("menu_compare"), title: "vergelijken", open: openCompareEvent.bind(backpack), close: closeCompareEvent.bind(backpack) },
    { event: document.getElementById("menu_whosThat"), title: "who's that pokemon", open: openWhosThatEvent.bind(backpack), close: closeWhosThatEvent.bind(backpack) },
    { event: document.getElementById("menu_battle"), title: "gevecht", open: openBattleEvent.bind(backpack), close: closeBattleEvent.bind(backpack) },
    { event: document.getElementById("menu_capture"), title: "vangen", open: openCaptureEvent.bind(backpack), close: closeCaptureEvent.bind(backpack) },
    { event: document.getElementById("mainMenu"), title: "rugzak", open: openMainMenu.bind(backpack), close: closeMainMenu.bind(backpack) },
  ];
  backpackIcon.addEventListener("click", (e) => {
    if (!player.isInEvent) {
      backpack.openMainMenu(backpack.menuEvents[backpack.menuEvents.length - 1].event);
    }
  })
  for (let i = 0; i < backpack.backpackBtns.length - 1; i++) {
    backpack.backpackBtns[i].addEventListener("click", (e) => {
      backpack.menuEvents[i].open(backpack.menuEvents[i].event);
    });
  }
  document.getElementById("backpack_closeBtn").addEventListener("click", (e) => {
    backpack.closeAllEvents();
  });
  document.getElementById("backpack_backBtn").addEventListener("click", (e) => {
    backpack.backbuttonPressed(backpack.currentMenu);
  });
  return backpack;
}


function closeAllEvents() {
  this.closeMenu();
  this.menuEvents.forEach((menuEvent) => {
    if (menuEvent.event.style.display === "block") {
      menuEvent.close(menuEvent.event);
    }
  });
  this.previousMenu = [];
  this.currentMenu = undefined;
  this.player.isInEvent = false;
}
function backbuttonPressed() {
  if (this.previousMenu.length > 0) {
    this.currentMenu.close(this.currentMenu.event);
    this.previousMenu[this.previousMenu.length - 1].open(this.previousMenu[this.previousMenu.length - 1].event);
    this.previousMenu.pop();
    this.previousMenu.pop();
  }
}


function openMenu() {
  this.player.isInEvent = true;
  this.backpackIcon.style.display = "none";
  this.backpackMenu.style.display = "block";
  document.getElementById("backpack_closeBtn").style.visibility = "visible";
}
function closeMenu() {
  this.player.isInEvent = false;
  this.backpackIcon.style.display = "block";
  this.backpackMenu.style.display = "none";
  // backpackMainMenu.style.display = "none";
}


// ========================= //
// ========= events ======== //
// ========================= //
function openEvent(event) {
  this.openMenu();
  if (this.currentMenu) {
    this.currentMenu.close(this.currentMenu.event);
    this.previousMenu.push(this.currentMenu);
  }
  this.currentMenu = this.menuEvents.find(menuEvent => menuEvent.event === event);
  this.currentMenu.event.style.display = "block";
  document.getElementById("backpackTitle").innerHTML = this.currentMenu.title;
}
// ========= main menu ======== //
function openMainMenu(event) {
  this.openEvent(event);
  document.getElementById("backpack_backBtn").style.visibility = "hidden";
}
function closeMainMenu(event) {
  event.style.display = "none";
  document.getElementById("backpack_backBtn").style.visibility = "visible";
}

// ========= pokedex ======== //
function openPokedexEvent(event) {
  this.openEvent(event);
  const table = event.getElementsByClassName("pokemon_list")[0].getElementsByTagName("table")[0];
  const filters = event.getElementsByClassName("pokedex_filter");
  for (let i = 0; i < filters.length; i++) {
    filters[i].addEventListener("input", () => { this.createPokemonList(table, getFilteredList(table), pokedexRowClick.bind(this)) });
  }
  resetFilters();
  this.createPokemonList(table, getFilteredList(table), pokedexRowClick.bind(this));
}
function closePokedexEvent(event) {
  event.style.display = "none";
  const table = event.getElementsByClassName("pokemon_list")[0].getElementsByTagName("table")[0];
  const filters = event.getElementsByClassName("pokedex_filter");
  for (let i = 0; i < filters.length; i++) {
    filters[i].replaceWith(filters[i].cloneNode(true));
  }
}

function resetFilters() {
  const filters = document.getElementsByClassName("pokedex_filter");
  filters[0].value = "";
  filters[1].checked = false;
  filters[2].checked = false;
  filters[3].value = "all";
  filters[4].value = "id";
}

function getFilteredList(table) {
  let filteredList = allPokemon;
  const filters = table.parentElement.getElementsByClassName("pokedex_filter");
  if (filters.length > 0) {
    const filterText = filters[0];
    const filterCaught = filters[1];
    const filterKnown = filters[2];
    const filterType = filters[3];
    const sortOption = filters[4];

    filteredList = filteredList.filter((pokemon) => {
      const matchesSearch = pokemon.name.toLowerCase().includes(filterText.value.toLowerCase());
      const isCaught = pokemon.isCaptured//Player.capturedPokemon.includes(pokemon);
      const isKnown = pokemon.isKnown;
      const isType = filterType.value === "all" || pokemon.types.some(t => t.type.name === filterType.value);
      return matchesSearch && (!filterCaught.checked || isCaught) && (!filterKnown.checked || isKnown) && isType;
    });
    filteredList.sort((a, b) => {if (sortOption.value === "hp") {
        return b.stats[0].base_stat - a.stats[0].base_stat; // HP
      } else if (sortOption.value === "attack") {
        return b.stats[1].base_stat - a.stats[1].base_stat; // Aanval
      } else if (sortOption.value === "speed") {
        return b.stats[5].base_stat - a.stats[5].base_stat; // Snelheid
      } else {
        return a.id - b.id;
      } 
    });
  }
  return filteredList;
}

function createPokemonList(table, pokemonList, rowClickFunction) {
  table.innerHTML = "";
  pokemonList.forEach(pokemon => {
    const tableRow = document.createElement("tr");
    tableRow.setAttribute("class", "tableRow");

    const pokemonImg = document.createElement("img");
    pokemonImg.setAttribute("class", "tableImg");
    pokemonImg.src = pokemon.sprites["front_default"];
    pokemonImg.style.filter = pokemon.isKnown ? "brightness(100%)" : "brightness(0%)";

    const pokemonInfo = document.createElement("p");
    pokemonInfo.setAttribute("class", "tableInfo");
    pokemonInfo.innerHTML = `#${pokemon.id}</br>${pokemon.isKnown ? pokemon.name : "???"}`;

    table.appendChild(tableRow);
    tableRow.appendChild(pokemonImg);
    tableRow.appendChild(pokemonInfo);
    tableRow.addEventListener("click", () => {
      if (pokemon.isKnown) {
        rowClickFunction(pokemon);
      }
      else {
        const menuEvent = this.menuEvents[3];//this.menuEvents.find(event=> event.title === "who's that pokemon");
        menuEvent.open(menuEvent.event, pokemon);
      }
    });
  })
}
function pokedexRowClick(pokemon) {
  const menuEvent = this.menuEvents[1];//this.menuEvents.find(event=> event.title === "stats");
  menuEvent.open(menuEvent.event, pokemon);
}
function compareLeftRowClick(pokemon) {
  const menuEvent = this.menuEvents[2];//this.menuEvents.find(event=> event.title === "stats");
  const compareSide = menuEvent.event.getElementsByClassName("compare_sides")[0];
  this.openCompareSide(compareSide, pokemon);
}
function compareRightRowClick(pokemon) {
  const menuEvent = this.menuEvents[2];//this.menuEvents.find(event=> event.title === "stats");
  const compareSide = menuEvent.event.getElementsByClassName("compare_sides")[1];
  this.openCompareSide(compareSide, pokemon);
}

// ========= pokedex detail ======== //
function openDetailEvent(event, pokemon) {
  this.openEvent(event);
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
  pokemonDiv.getElementsByTagName("p")[0].innerHTML = pokemon.isKnown ? pokemon.name : "???";
  pokemonDiv.getElementsByTagName("img")[0].src = pokemon.sprites["front_default"];
  pokemonDiv.getElementsByTagName("img")[0].style.filter = pokemon.isKnown ? "brightness(100%)" : "brightness(0%)";
  const buttonsDiv = pokedexDetails.children[2];
  const buttons = buttonsDiv.getElementsByTagName("button");
  buttons[0].replaceWith(buttons[0].cloneNode(true));
  buttons[0].addEventListener("click", () => {
    this.player.setCompanion(pokemon);
  })
  buttons[1].replaceWith(buttons[1].cloneNode(true));
  buttons[1].addEventListener("click", () => {
    this.player.releasePokemon(pokemon);
  })
  buttons[2].replaceWith(buttons[2].cloneNode(true));
  buttons[2].addEventListener("click", () => {
    const menuEvent = this.menuEvents[2];//this.menuEvents.find(event=> event.title === "vergelijken");
    const compareSide = menuEvent.event.getElementsByClassName("compare_sides")[0];
    openCompareSide(compareSide, pokemon);
    menuEvent.open(menuEvent.event)
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
    const evolutionPokemon = allPokemon.find(value => { value.name === pokemon.evolution_chain[i].name });
    const isKnown = evolutionPokemon ? (evolutionPokemon.isKnown) : false;
    evolutionSteps[i].children[1].innerHTML = isKnown ? pokemon.evolution_chain[i].name : "???";
    evolutionSteps[i].children[0].src = pokemon.evolution_chain[i].sprite;
    evolutionSteps[i].children[0].style.filter = isKnown ? "brightness(100%)" : "brightness(0%)";
    evolutionSteps[i].style.display = "block";
    if (i > 0) {
      evolutionArrows[i - 1].style.display = "block";
    }
  }
}
function closeDetailsEvent(event) {
  event.style.display = "none"
}

// ========= compare ======== //
function openCompareEvent(event) {
  this.openEvent(event);
  const tableLeft = event.getElementsByClassName("pokemon_list")[0];
  const tableRight = event.getElementsByClassName("pokemon_list")[1];
  resetFilters();
  this.createPokemonList(tableLeft, getFilteredList(event), compareLeftRowClick.bind(this));
  this.createPokemonList(tableRight, getFilteredList(event), compareRightRowClick.bind(this));
}
function closeCompareEvent(event) {
  const compareSides = event.getElementsByClassName("compare_sides");
  const tables = event.getElementsByClassName("pokemon_list");
  for (let i = 0; i < compareSides.length; i++) {
    tables[i].style.display = "block";
    compareSides[i].style.display = "none";
  }
  event.style.display = "none"
}
function openCompareSide(compareSide, pokemon) {
  compareSide.getElementsByTagName("img")[0].src = pokemon.sprites["front_default"];
  compareSide.getElementsByTagName("p")[0].innerHTML = pokemon.name;
  const statsDiv = compareSide.getElementsByTagName("div")[0];
  const stats = statsDiv.getElementsByTagName("span");
  for (let i = 0; i < stats.length; i++) {
    stats[i].innerHTML = `${pokemon.stats[i].base_stat}`;
  }
  const table = compareSide.parentElement.getElementsByClassName("pokemon_list")[0];
  const button = compareSide.getElementsByTagName("button")[0];
  button.addEventListener("click", () => {
    table.style.display = "block";
    compareSide.style.display = "none";
  });
  compareSide.style.display = "block";
  table.style.display = "none";


  updateCompareSides();
}
function updateCompareSides(){
  let isBothChosen = true;
  const sides = document.getElementById("menu_compare").getElementsByClassName("compare_sides");
  for (let i = 0; i < sides.length; i++) {
    if (sides[i].style.display !== "block") {
      isBothChosen = false;
    }
  }
  if (isBothChosen) {
    const statsDivLeft = sides[0].getElementsByTagName("div")[0];
    const statsLeft = statsDivLeft.getElementsByTagName("span");
    const statsDivRight = sides[1].getElementsByTagName("div")[0];
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

// ========= who's that pokemon ======== //
function openWhosThatEvent(event, pokemon) {
  this.openEvent(event);
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
  button.style.display = "block";
  button.innerHTML = "bevestigen";
  button.addEventListener("click", () => {
    if (input.value === pokemon.name) {
      pokemon.isKnown = true;
      img.style.filter = "brightness(100%)";
      name.innerHTML = pokemon.name;
      input.style.display = "none";
      button.style.display = "none"
      button.replaceWith(button.cloneNode(true));
    }
    else {
      alert("dat is niet de juiste pokemon");
    }
  });
}
function closeWhosThatEvent(event) {
  event.style.display = "none";
}



// ========= battle ======== //
export function openBattleEvent() {
  const event = this.menuEvents[4]//this.menuEvents.find(event => event.title === "gevecht");
  this.openEvent(event.event);
  document.getElementById("backpack_closeBtn").style.visibility = "hidden";
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
  const event = this.menuEvents[4]//this.menuEvents.find(event => event.title === "gevecht");
  event.event.style.display = "none";
  this.closeAllEvents();
}

// ========= capture ======== //
export function openCaptureEvent(player, pokemon) {
  const event = this.menuEvents[5]//this.menuEvents.find(event => event.title === "vangen");
  this.openEvent(event.event);
  const element = document.getElementById("capture_main");
  const stage = {
    name: element.children[0],
    img: element.children[1],
    button: element.children[2],
    chances: document.getElementById("capture_chances"),
    nickNameDiv: document.getElementById("capture_nickname"),
  }
  return stage;
}

export function closeCaptureEvent() {
  const event = this.menuEvents[5]//this.menuEvents.find(event => event.title === "vangen");
  event.event.style.display = "none";
  this.closeAllEvents();
  const nickNameDiv = document.getElementById("capture_nickname");
  nickNameDiv.replaceWith(nickNameDiv.cloneNode(true));
  const captureBtn = document.getElementById("capture_button");
  captureBtn.replaceWith(captureBtn.cloneNode(true));
}
