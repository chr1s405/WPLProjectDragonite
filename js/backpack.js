import { Player } from "./gameObjects/player.js";


const backpackIcon = document.getElementById("backpackIcon");
const backpackMenu = document.getElementById("backpackMenu")
const backpackCloseBtn = document.getElementById("backpackMenuCloseBtn");
const backpackMenuItems = document.getElementsByClassName("backpackMenuBtn");
const menuEvents = document.getElementsByClassName("menuEvent");
const pokedexMenuEvent = document.getElementById("menu_pokedex");
const pokedexDetailMenuEvent = document.getElementById("menu_pokemonDetail");
const compareMenuEvent = document.getElementById("menu_compare");
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
compareMenuEvent.getElementsByClassName("closeBtn")[0].addEventListener("click", (e) => {
  closeCompareEvent();
})
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
  backpackMenu.style.display = "block";
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

export function openBattleEvent() {
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

export function createPokemonList(allPokemon) {
  const tables = document.getElementsByClassName("pokemon_list");
  for (let i = 0; i < tables.length; i++) {
    const table = tables[i].getElementsByTagName("table")[0];
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

      tableRow.addEventListener("click", () => {
        if (i === 0) {
          openDetailPage(pokemon);
          pokedexMenuEvent.style.display = "none"
        }
        else {
          const compareSide = compareMenuEvent.getElementsByClassName("compare_sides")[i - 1];
          createCompareSide(compareSide, pokemon);
        }
      })
    });
  }
}
function openDetailPage(pokemon, player) {
  const pokedexDetails = document.getElementById("pokedex_detail");
  const statsDiv = pokedexDetails.children[0];
  const stats = statsDiv.getElementsByTagName("p");
  for (let i = 2; i < stats.length; i++) {
    const text = stats[i].innerHTML;
    stats[i].innerHTML = text.substring(0, text.indexOf(':') + 1) + ` ${pokemon.stats[i - 2].base_stat}`
  }
  const pokemonDiv = pokedexDetails.children[1];
  pokemonDiv.getElementsByTagName("p")[0].innerHTML = pokemon.name;
  pokemonDiv.getElementsByTagName("img")[0].src = pokemon.sprites["front_default"];
  const buttonsDiv = pokedexDetails.children[2];
  const buttons = buttonsDiv.getElementsByTagName("button");
  buttons[0].replaceWith(buttons[0].cloneNode(true));
  buttons[0].addEventListener("click", () => {
    if (Player.capturedPokemon.includes(pokemon)) {
      Player.setCompanion(pokemon);
    }
    else {
      alert("je hebt deze pokemon nog niet gevangen")
    }
  })
  buttons[1].replaceWith(buttons[1].cloneNode(true));
  buttons[1].addEventListener("click", () => {
    if (Player.companion.pokemon === pokemon) {
      Player.removeCompanion();
    }
    else {
      alert("dit is niet jouw companion")
    }
  })
  buttons[2].replaceWith(buttons[2].cloneNode(true));
  buttons[2].addEventListener("click", () => {
    closeDetailsPage();
    const compareSide = compareMenuEvent.getElementsByClassName("compare_sides")[0];
    createCompareSide(compareSide, pokemon);
    openCompareEvent();
  })
  pokedexDetailMenuEvent.style.display = "block"
}
function closeDetailsPage() {
  pokedexDetailMenuEvent.style.display = "none"
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
  let isDone = true;
  const sides = compareMenuEvent.getElementsByClassName("compare_sides");
  for (let i = 0; i < sides.length; i++) {
    console.log(i)
    console.log(sides[i].style.display)
    if (sides[i].style.display !== "block") {
      isDone = false;
    }
  }
  if (isDone) {
    const statsDivLeft = compareMenuEvent.getElementsByClassName("compare_sides")[0].getElementsByTagName("div")[0];
    const statsLeft = statsDivLeft.getElementsByTagName("span");
    const statsDivRight = compareMenuEvent.getElementsByClassName("compare_sides")[1].getElementsByTagName("div")[0];
    const statsRight = statsDivRight.getElementsByTagName("span");
    for (let i = 0; i < statsLeft.length; i++) {
      const difference = statsLeft[i].innerHTML.match(/\d+/g)[0] - statsRight[i].innerHTML.match(/\d+/g)[0];
      if (difference !== 0) {
        const textLeft = ` ${difference < 0 ? "-" : "+"}${Math.abs(difference)}`
        const textRight = ` ${difference < 0 ? "+" : "-"}${Math.abs(difference)}`
        statsLeft[i].setAttribute("class", difference < 0 ? "redText" : "greenText");
        statsRight[i].setAttribute("class", difference < 0 ? "greenText" : "redText");
        statsLeft[i].innerHTML += textLeft;
        statsRight[i].innerHTML += textRight;
      }
    }
  }
}
function openCompareEvent() {
  compareMenuEvent.style.display = "block";
}
function closeCompareEvent() {
  const compareSides = compareMenuEvent.getElementsByClassName("compare_sides");
  const tables = compareMenuEvent.getElementsByClassName("pokemon_list");
  for (let i = 0; i < compareSides.length; i++) {
    tables[i].style.display = "block";
    compareSides[i].style.display = "none";
  }
  closeMenu();
}


// event listeren voor back knop om terug gaan naar de rugzak
document.addEventListener("DOMContentLoaded", function () {
  const backToBackpackBtns = document.querySelectorAll("#backToBackpack"); 
  const backpackMenu = document.getElementById("backpackMenu");
  const allMenus = document.querySelectorAll(".menuEvent"); 

  backToBackpackBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      allMenus.forEach((menu) => {
        menu.style.display = "none"; 
      });

      backpackMenu.style.display = "block"; 
    });
  });
});

