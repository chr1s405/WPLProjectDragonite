import { Player } from "./gameObjects/player.js";


const backpackIcon = document.getElementById("backpackIcon");
const backpackMenu = document.getElementById("backpackMenu")
const backpackMenuItems = document.getElementsByClassName("backpackMenuBtn");
const pokedexMenuEvent = document.getElementById("menu_pokedex");
const pokedexDetailMenuEvent = document.getElementById("menu_pokemonDetail");
const compareMenuEvent = document.getElementById("menu_compare");
const whosThatMenuEvent = document.getElementById("menu_who'sThat");
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


backpackIcon.addEventListener("click", (e) => {
  openMenu();
})
for (let i = 0; i < backpackMenuItems.length - 1; i++) {
  backpackMenuItems[i].addEventListener("click", (e) => {
    openEvent(menuEvents[i].event);
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
function backbuttonPressed(currentMenu) {
  currentMenu.close();
  previousMenu[previousMenu.length - 1].open();
  previousMenu.pop();
}


function openMenu() {
  Player.isInEvent = true;
  backpackIcon.style.display = "none";
  backpackMenu.style.display = "block";
}
function openEvent(event) {
  Player.isInEvent = true;
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


// ========= pokedex ======== //
function openPokedexEvent() {
  Player.isInEvent = true;
  pokedexMenuEvent.style.display = "block"
}
function closePokedexEvent() {
  pokedexMenuEvent.style.display = "none"
}
// ik heb de function creatPokemonList aangepast zodanig dat de filters werken 
export function createPokemonList(allPokemon) {
  const tables = document.getElementsByClassName("pokemon_list");

  // Selecteer de invoervelden en filters
  const searchInput = document.getElementById("pokedex_search");
  const filterCheckbox = document.getElementById("pokedex_filter_caught");
  const typeFilter = document.getElementById("pokedex_filter_type");
  const sortFilter = document.getElementById("pokedex_sort");

  function updateList() {
      let searchText = searchInput.value.toLowerCase();
      let onlyCaught = filterCheckbox.checked;
      let selectedType = typeFilter.value;
      let sortOption = sortFilter.value;

      for (let i = 0; i < tables.length; i++) {
          const table = tables[i].getElementsByTagName("table")[0];
          table.innerHTML = ""; // Maak de lijst leeg

          // Filter Pokémon
          let filteredList = allPokemon.filter(pokemon => {
              let matchesSearch = pokemon.name.toLowerCase().includes(searchText);
              let isCaught = Player.capturedPokemon.includes(pokemon); // Controleer of de Pokémon gevangen is
              let matchesType = selectedType === "all" || pokemon.types.some(t => t.type.name === selectedType);
              
              return matchesSearch && (!onlyCaught || isCaught) && matchesType;
          });

          // Sorteer Pokémon op geselecteerde optie
          filteredList.sort((a, b) => {
              if (sortOption === "id") {
                  return a.id - b.id;
              } else if (sortOption === "hp") {
                  return b.stats[0].base_stat - a.stats[0].base_stat; // HP
              } else if (sortOption === "attack") {
                  return b.stats[1].base_stat - a.stats[1].base_stat; // Aanval
              } else if (sortOption === "speed") {
                  return b.stats[5].base_stat - a.stats[5].base_stat; // Snelheid
              }
              return 0;
          });

          // Voeg de gefilterde en gesorteerde Pokémon toe aan de lijst
          filteredList.forEach(pokemon => {
              const tableRow = document.createElement("tr");
              tableRow.setAttribute("class", "tableRow");

              const pokemonImg = document.createElement("img");
              pokemonImg.setAttribute("class", "tableImg");
              pokemonImg.src = pokemon.sprites["front_default"];

              const pokemonInfo = document.createElement("p");
              pokemonInfo.setAttribute("class", "tableInfo");
              pokemonInfo.innerHTML = `#${pokemon.id} - ${pokemon.name}`;

              table.appendChild(tableRow);
              tableRow.appendChild(pokemonImg);
              tableRow.appendChild(pokemonInfo);

              tableRow.addEventListener("click", () => {
                  if (i === 0) {
                      openDetailEvent(pokemon);
                      previousMenu.push(menuEvents.find(menuEvent => menuEvent.event === pokedexMenuEvent));
                      pokedexMenuEvent.style.display = "none";
                  } else {
                      const compareSide = compareMenuEvent.getElementsByClassName("compare_sides")[i - 1];
                      createCompareSide(compareSide, pokemon);
                  }
              });
          });
      }
  }

  // Voeg event listeners toe aan de zoekbalk en filters
  searchInput.addEventListener("input", updateList);
  filterCheckbox.addEventListener("change", updateList);
  typeFilter.addEventListener("change", updateList);
  sortFilter.addEventListener("change", updateList);

  // Initialiseer de lijst
  updateList();
}





// ========= pokedex detail ======== //
function openDetailEvent(pokemon) {
  Player.isInEvent = true;
  pokedexDetailMenuEvent.style.display = "block";
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
  pokemonDiv.getElementsByTagName("p")[0].innerHTML = pokemon.nickname !== "" ? pokemon.nickname : pokemon.name;
  pokemonDiv.getElementsByTagName("img")[0].src = pokemon.sprites["front_default"];
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
    createCompareSide(compareSide, pokemon);
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
    evolutionSteps[i].children[0].src = pokemon.evolution_chain[i].sprite;
    evolutionSteps[i].children[1].innerHTML = pokemon.evolution_chain[i].name;
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
function createCompareSide(compareSide, pokemon) {
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
      console.log(textLeft);
      console.log(textRight);
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
function openWhosThatEvent() {
  Player.isInEvent = true;
  whosThatMenuEvent.style.display = "blok";
}
function closeWhosThatEvent() {
  whosThatMenuEvent.style.display = "none";
}

// ========= battle ======== //
export function openBattleEvent() {
  Player.isInEvent = true;
  battleMenuEvent.style.display = "block";
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
