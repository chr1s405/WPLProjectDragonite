//initialize
let windowWidth = window.innerWidth;
let windowHeight = window.innerHeight;

const overworldMap = document.getElementById("overworldMap");
let minWidth = overworldMap.offsetLeft;
let minHeight = overworldMap.offsetTop;
let maxWidth = overworldMap.clientWidth;
let maxHeight = overworldMap.clientHeight;

const character = document.getElementById("character");
const characterWidth = character.clientWidth;
const characterHeight = character.clientHeight;
let characterX = Number(character.style.left.substring(0,character.style.left.indexOf("px")));
let characterY = Number(character.style.top.substring(0,character.style.top.indexOf("px")));
const characterSpeed = 50;
ScrollMap();


//eventlisteners
addEventListener("keydown", (e)=>{
    if(e.keyCode === 87/*w*/){ moveY(-characterSpeed);};
    if(e.keyCode === 65/*a*/){ moveX(-characterSpeed);};
    if(e.keyCode === 83/*s*/){ moveY( characterSpeed);};
    if(e.keyCode === 68/*d*/){ moveX( characterSpeed);};
    if(e.keyCode === 85/*u*/){ DebugInfo();};
    ScrollMap();
})
addEventListener("resize", ()=>{
    resizeWindow();
    ScrollMap();
})

//functions
function resizeWindow(){
    windowWidth  = window.innerWidth;
    windowHeight = window.innerHeight;
    cameraLeftBorder = minWidth + windowWidth / 2;
    cameraTopBorder = minHeight + windowHeight / 2;
}

function ScrollMap(){
    let x = minWidth + characterX - windowWidth/2;
    let y = minHeight + characterY - windowHeight/2;
    window.scroll(Math.max(minWidth, x), Math.max(minHeight, y));
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
function DebugInfo(){
    console.clear()
    console.log(`window:\nwidth: ${windowWidth}\nheight: ${windowHeight}`);
    console.log(`overworld map:\nx: ${minWidth}\ny: ${minHeight}\nwidth: ${maxWidth}\nheight: ${maxHeight}`);
    console.log(`character:\nx: ${characterX}\ny: ${characterY}`)
}