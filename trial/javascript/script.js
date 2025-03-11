const magic = document.getElementById("firstsmallrectangle")
const bigRectangle = document.getElementById("choicerectangle")
const magicImg = document.getElementById("magicimg")
const projectBackground = document.getElementById("projectbackground")


function RectangelToMagic(){
    
    bigRectangle.appendChild(magicImg)

}

function RectangleTOLego(){}


magic.addEventListener("click", RectangelToMagic);