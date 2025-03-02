const backpackIcon = document.getElementById("backpackIcon");
const backpackMenu = document.getElementById("backpackMenu")
const backpackCloseBtn = document.getElementById("backpackMenuCloseBtn")
const backpackMenuItems = document.getElementsByClassName("backpackMenuBtn");
const menuEvents = document.getElementsByClassName("menuEvent");
const battleMenuEvent = document.getElementById("menu_battle");
const captureMenuEvent = document.getElementById("menu_capture")

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
battleMenuEvent.children[0].addEventListener("click", (e) => {
  closeBattleEvent()
})
captureMenuEvent.children[0].addEventListener("click", (e) => {
  closeCaptureEvent()
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
export function openBattleEvent() {
  const player = battleMenuEvent.children[1];
  const enemy = battleMenuEvent.children[2];
  const stage = [{
    img: player.children[1],
    name: player.getElementsByClassName("statusbar")[0].children[0],
    hp: player.getElementsByClassName("hp-bar")[0].children[0],
    hpBar: player.getElementsByClassName("hp-bar")[0],
  },
  {
    img: enemy.children[1],
    name: enemy.getElementsByClassName("statusbar")[0].children[0],
    hp: enemy.getElementsByClassName("hp-bar")[0].children[0],
    hpBar: enemy.getElementsByClassName("hp-bar")[0],
  }]
  battleMenuEvent.style.display = "grid";
  return stage;
}
export function closeBattleEvent() {
  battleMenuEvent.style.display = "none"
  closeMenu();
}
function openCaptureEvent() {
  captureMenuEvent.style.display = "block"
}
function closeCaptureEvent() {
  captureMenuEvent.style.display = "none";
  closeMenu();
}