let windowWidth;
let windowHeight;

const overworldMap = document.getElementById("overworldMap");
let maxWidth = overworldMap.clientWidth;
let maxHeight = overworldMap.clientHeight;
//console.log(`width: ${maxWidth}\nheight: ${maxHeight}`);

const character = document.getElementById("character");
const characterWidth = character.clientWidth;
const characterHeight = character.clientHeight;
let characterX = Number(character.style.left.substring(0,character.style.left.indexOf("px")));
let characterY = Number(character.style.top.substring(0,character.style.top.indexOf("px")));
const characterSpeed = 50;

resizeWindow();

document.addEventListener("keydown", (e)=>{
    if(e.keyCode === 87/*w*/){ moveY(-characterSpeed);};
    if(e.keyCode === 65/*a*/){ moveX(-characterSpeed);};
    if(e.keyCode === 83/*s*/){ moveY( characterSpeed);};
    if(e.keyCode === 68/*d*/){ moveX( characterSpeed);};
    window.scroll(characterX - windowWidth/2, characterY - windowHeight/2);
    //console.log(`( ${characterX} , ${characterY})`)
})
addEventListener("resize", resizeWindow);
function resizeWindow(){
    windowWidth  = window.innerWidth;
    windowHeight = window.innerHeight;
    window.scroll(characterX - windowWidth/2, characterY - windowHeight/2);
    //console.log(`windowWidth: ${windowWidth}\nwindowHeight: ${windowHeight}`);
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