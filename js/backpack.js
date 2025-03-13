import { Player } from "./gameObjects/player.js";


const backpackIcon = document.getElementById("backpackIcon");
const backpackMenu = document.getElementById("backpackMenu")
const menuDex = document.getElementById("menu_pokedex")
const backpackCloseBtn = document.getElementById("backpackMenuCloseBtn")
const backpackMenuItems = document.getElementsByClassName("backpackMenuBtn");
const backpackMenuDex = document.getElementById("backpackMenuBtnDex");
const menuEvents = document.getElementsByClassName("menuEvent");
const battleMenuEvent = document.getElementById("menu_battle");
const captureMenuEvent = document.getElementById("menu_capture")
const isDexMenuOpen = false;


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

  menuEvents[i].children[0].addEventListener("click", (e) => {
    closeMenu(menuEvents[i]);
  })
}

function openDexMenu(){
  openEvent(menuDex)
  isDexMenuOpen = true;
}

backpackMenuDex.addEventListener("click", openDexMenu)


function closeDexMenu(){
  closeMenu(menuDex);
  isDexMenuOpen = false;
}


menuDex.children[0].addEventListener("click", closeDexMenu)

if (isDexMenuOpen === true){
  menuDex.style.display = "grid";
}

if (isDexMenuOpen === false){
  menuDex.style.display = "none";
}

battleMenuEvent.children[0].addEventListener("click", (e) => {
  closeBattleEvent()
  Player.isInEvent = false;
})
captureMenuEvent.children[0].addEventListener("click", (e) => {
  closeCaptureEvent()
  Player.isInEvent = false;
})

function openMenu() {
  backpackIcon.style.display = "none";
  backpackMenu.style.display = "grid";
  
}

function closeMenu(event = undefined) {
  backpackIcon.style.display = "block";
  backpackMenu.style.display = "none";
  if (event !== undefined) {
    event.style.display = "none";
  }
}

function openEvent(event) {
  backpackMenu.style.display = "none"
  event.style.display = "block";
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



// event listeren voor back knop om terug gaan naar de rugzak
document.addEventListener("DOMContentLoaded", function () {
  const backToBackpackBtn = document.getElementById("backToBackpack");
  const backpackMenu = document.getElementById("backpackMenu");
  const menuPokedex = document.getElementById("menu_pokedex");

  if (backToBackpackBtn) {
      backToBackpackBtn.addEventListener("click", function () {
          menuPokedex.style.display = "none";  // Verberg het Pokédex-menu
          backpackMenu.style.display = "grid"; // Toon het rugzak-menu opnieuw
      });
  }
});
