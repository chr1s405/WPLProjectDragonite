//initialize
let windowWidth = window.innerWidth;
let windowHeight = window.innerHeight;

const overworldMap = document.getElementById("overworldMap");
const minWidth = overworldMap.offsetLeft;
const minHeight = overworldMap.offsetTop;
const maxWidth = overworldMap.clientWidth;
const maxHeight = overworldMap.clientHeight;

const character = document.getElementById("character");
const characterWidth = character.clientWidth;
const characterHeight = character.clientHeight;
let characterX = character.offsetLeft;
let characterY = character.offsetTop;
const characterSpeed = 50;

const debug = document.getElementById("debug");

ScrollMap();
Debug()

//eventlisteners
addEventListener("keydown", (e)=>{
    if(e.keyCode === 87/*w*/){ moveY(-characterSpeed);};
    if(e.keyCode === 65/*a*/){ moveX(-characterSpeed);};
    if(e.keyCode === 83/*s*/){ moveY( characterSpeed);};
    if(e.keyCode === 68/*d*/){ moveX( characterSpeed);};
    if(e.keyCode === 79/*o*/){ ToggleDebug();};
    ScrollMap();
    Debug();
})
addEventListener("resize", ()=>{
    resizeWindow();
    ScrollMap();
})

//functions
function resizeWindow(){
    windowWidth  = window.innerWidth;
    windowHeight = window.innerHeight;
}

function ScrollMap(){
    let x = minWidth + characterX - windowWidth/2;
    let y = minHeight + characterY - windowHeight/2;
    let xMax = maxWidth - windowWidth;
    let yMax = maxHeight - windowHeight;
    overworldMap.style.left = `${Math.min(minWidth, Math.max(-x, -xMax))}px`;
    overworldMap.style.top  = `${Math.min(minHeight, Math.max(-y, -yMax))}px`;
}
function moveX(x){
    characterX += x;
    if(characterX < 0){
        characterX = 0;
    }
    if((characterX + characterWidth) > maxWidth){
        characterX = maxWidth - characterWidth;
    }
    character.style.left = `${characterX}px`;
}
function moveY(y){
    characterY += y;
    if((characterY) < 0){
        characterY = 0;
    }
    if(characterY + characterHeight > maxHeight){
        characterY = maxHeight - characterHeight;
    }
    character.style.top = `${characterY}px`;
}
function ToggleDebug(){
    if(debug.style.display === "none"){
        debug.style.display = "inline";
    }
    else{
        debug.style.display = "none"
    }
}
function Debug(){
    document.getElementById("characterCoor").innerHTML =
    `character: (${character.style.left}, ${character.style.top})`;
    document.getElementById("mapCoor").innerHTML =
    `overworld map: (${overworldMap.style.left}, ${overworldMap.style.top})`;
}