const magic = document.getElementById("firstsmallrectangle")
const bigRectangle = document.getElementById("choicerectangle")
const magicImg = document.getElementById("magicimg")
const projectBackground = document.getElementById("projectbackground")
const legoImg = document.getElementById("legoimg")
const lego = document.getElementById("secondsmallrectangle")
const isMagicActive = false
const isLegoActive = false

function emptyOut(){
    if (isMagicActive === true){
        magicImg.remove()
        isMagicActive = false
    }

    if (isLegoActive === true){
        legoImg.remove()
        isLegoActive = false
    }
}

function RectangleToMagic(){
    emptyOut()
    if(isMagicActive === false){
    bigRectangle.style.backgroundColor = "white"
    bigRectangle.appendChild(magicImg)
    isMagicActive = true
    }
}

function RectangleToLego(){
    emptyOut()
    if(isLegoActive === false){
    bigRectangle.style.backgroundColor = "red"
    bigRectangle.appendChild(legoImg)
    isLegoActive = true
    }
}

magic.addEventListener("click", RectangleToMagic)
lego.addEventListener("click", RectangleToLego)