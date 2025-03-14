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

    tableRow.addEventListener("click", () => {
      openDetailPage(pokemon);
      pokedexMenuEvent.style.display = "none"
    })
  });
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
  // for(let i = 0; i < buttons.length; i++)
  // {
  // }
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
    openCompareEvent(pokemon, Player.companion.pokemon);
  })
  pokedexDetailMenuEvent.style.display = "block"
}
function closeDetailsPage() {
  pokedexDetailMenuEvent.style.display = "none"
}

export function openCompareEvent(pokemonLeft, pokemonRight) {
  const stage = document.getElementsByClassName("compare_sides");
  stage[0].getElementsByTagName("img")[0].src = pokemonLeft.sprites["front_default"];
  stage[0].getElementsByTagName("p")[0].innerHTML = pokemonLeft.name;
  const statsDivLeft = stage[0].getElementsByTagName("div")[0];
  const statsLeft = statsDivLeft.getElementsByTagName("span");
  stage[1].getElementsByTagName("img")[0].src = pokemonRight.sprites["front_default"];
  stage[1].getElementsByTagName("p")[0].innerHTML = pokemonRight.name;
  const statsDivRight = stage[1].getElementsByTagName("div")[0];
  const statsRight = statsDivRight.getElementsByTagName("span");
    for (let i = 0; i < statsLeft.length; i++) {
    let textLeft = `${pokemonLeft.stats[i].base_stat}`;
    let textRight = `${pokemonRight.stats[i].base_stat}`;
    const difference = pokemonLeft.stats[i].base_stat - pokemonRight.stats[i].base_stat;
    if (difference < 0) {
      textLeft += ` -${Math.abs(difference)}`
      textRight += ` +${Math.abs(difference)}`;
      statsLeft[i].setAttribute("class","redText");
      statsRight[i].setAttribute("class","greenText");
    }
    else if (difference > 0) {
      textLeft += ` +${Math.abs(difference)}`
      textRight += ` -${Math.abs(difference)}`;
      statsLeft[i].setAttribute("class","greenText");
      statsRight[i].setAttribute("class","redText");
    }
    else{
      statsLeft[i].setAttribute("class","");
      statsRight[i].setAttribute("class","");
    }
      statsLeft[i].innerHTML = textLeft;
      statsRight[i].innerHTML = textRight;
  }
  compareMenuEvent.style.display = "block";
}


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

