const backpackIcon = document.getElementById("backpackIcon");
backpackIcon.addEventListener("click",(e)=>{
    openMenu();
})

function openMenu(){
    backpackIcon.style.display = "none";
    
}
function CloseMenu(){
    backpackIcon.style.display = "block";
}