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
  console.log(stage)
  return stage;
}
export function closeBattleEvent() {
  battleMenuEvent.style.display = "none"
  closeMenu();
}

export function openCaptureEvent() {
  captureMenuEvent.style.display = "grid"
  const element = document.getElementById("capture_main");
  const stage = {
   name: element[0],
   img: element[1],
   button: element[2],
  }
  return stage;
}

export function closeCaptureEvent() {
  captureMenuEvent.style.display = "none";
  closeMenu();
}