const backpackIcon = document.getElementById("backpackIcon");
const backpackMenu = document.getElementById("backpackMenu")
const backpackCloseBtn = document.getElementById("backpackMenuCloseBtn")
backpackIcon.addEventListener("click",(e)=>{
    openMenu();
})
backpackCloseBtn.addEventListener("click",(e)=>{
    CloseMenu();
})

function openMenu(){
    backpackIcon.style.display = "none";
    backpackMenu.style.display = "grid";
    
}
function CloseMenu(){
    backpackIcon.style.display = "block";
    backpackMenu.style.display = "none";
}