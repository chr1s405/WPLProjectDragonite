//initialize
import mapData from "./map.json"  with { type: "json" };
const mapcollisionTiles = [1,2,3,11,13,21,22,23,5,6,7,15,16,17,25,26,27,31,51,52,53,61,62,63,71,72,73]
let windowWidth = window.innerWidth;
let windowHeight = window.innerHeight;

const overworldMap = document.getElementById("overworldMap");
overworldMap.style.width = `${mapData["width"] * 50}px`;
overworldMap.style.height = `${mapData["height"] * 50}px`;
overworldMap.style.backgroundSize = overworldMap.style.width
const minWidth = overworldMap.offsetLeft;
const minHeight = overworldMap.offsetTop;
console.log(minHeight)
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

function ScrollMap(){// scrolling right means pushing left in negative
    let x = (characterX + characterWidth/2) - (minWidth + windowWidth)/2;
    let y = (characterY + characterHeight/2) - (minHeight + windowHeight)/2;
    let xMax = maxWidth - windowWidth;
    let yMax = maxHeight - windowHeight;
    overworldMap.style.left = `${Math.min(minWidth, Math.max(-x, -xMax))}px`;
    overworldMap.style.top  = `${Math.min(minHeight, Math.max(-y, -yMax))}px`;
}
function moveX(speed){
    let x = characterX + speed
    if(x < 0 || x + characterWidth > maxWidth)
    {
        return;
    }
    if(!mapcollisionTiles.includes(mapData["layers"][1]["data"][(PositionInGrid(x, characterY))])){
        characterX += speed;
        character.style.left = `${characterX}px`;
    }
}
function moveY(speed){
    let y = characterY + speed
    if  (y < 0 || y + characterHeight > maxHeight)
    {
        return
    }
    if(!mapcollisionTiles.includes(mapData["layers"][1]["data"][(PositionInGrid(characterX, y))])){
        characterY += speed;
        character.style.top = `${characterY}px`;
    }
}
function PositionInGrid(x,y){
    return (y / mapData["tileheight"]) * mapData["width"] + (x / mapData["tilewidth"])
}


function ToggleDebug(){
    if(debug.style.display === "none"){
        debug.style.display = "block";
    }
    else{
        debug.style.display = "none"
    }
}
function Debug(){
    document.getElementById("characterCoor").innerHTML =
    `character: (${character.style.left}, ${character.style.top}) ${PositionInGrid(characterX, characterY)}`;
    document.getElementById("mapCoor").innerHTML =
    `overworld map: (${overworldMap.style.left}, ${overworldMap.style.top})`;
}