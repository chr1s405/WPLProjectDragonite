const backpackIcon = document.getElementById("backpackIcon");
const backpackMenu = document.getElementById("backpackMenu")
const backpackCloseBtn = document.getElementById("backpackMenuCloseBtn")
const backpackMenuItems = document.getElementsByClassName("backpackMenuBtn");
const menuEvents = document.getElementsByClassName("menuEvent");

backpackIcon.addEventListener("click", (e) => {
    openMenu();
})
backpackCloseBtn.addEventListener("click", (e) => {
    CloseMenu();
})
for (let i = 0; i < backpackMenuItems.length - 1; i++) {
    backpackMenuItems[i].addEventListener("click", (e) => {
        openEvent();
        menuEvents[i].style.display = "block";

    });
    menuEvents[i].children[0].addEventListener("click",(e)=>{
        menuEvents[i].style.display = "none";
        closeEvent();
    })
}

function openMenu() {
    backpackIcon.style.display = "none";
    backpackMenu.style.display = "grid";

}
function CloseMenu() {
    backpackIcon.style.display = "block";
    backpackMenu.style.display = "none";
}
function openEvent(){
    backpackMenu.style.display = "none"
}
function closeEvent(){
    backpackIcon.style.display = "block"
}
/* Julienne WhosThatPokemon */
