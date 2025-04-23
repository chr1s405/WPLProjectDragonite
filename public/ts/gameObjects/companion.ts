import { Companion, Map, Player, Pokemon } from "../../../interfaces";

export function createCompanion(owner: Player) {
    const companionDiv: any = document.getElementById("companion");
    const companion: Companion = {
        div: companionDiv,
        x: 0,
        y: 0,
        width: companionDiv.clientWidth,
        height: companionDiv.clientHeight,
        speed: 18,
        pokemon: undefined,
        owner: owner,

        isDebugOn: false,

        update,
        move,
        setCompanion,
        removeCompanion,
        toggleDebug,
        debug,
    }
    return companion
}
function setCompanion(this: Companion, pokemon: Pokemon){
    this.x = this.owner.x + 50;
    this.y = this.owner.y;
    this.pokemon = pokemon;
    this.div.style.display = "block";
    this.div.style.backgroundImage = `url(${pokemon.sprites["front_default"]})`
}
function removeCompanion(this: Companion, ){
    this.pokemon = undefined;
    this.div.style.display = "none";
}
function update(this: Companion, map: Map) {
    this.move(map);
    this.div.style.left = `${this.x}px`;
    this.div.style.top = `${this.y}px`;
    if (this.isDebugOn) {
        this.debug(map);
    }
}
function move(this: Companion, map: Map) {
    const distX = (this.owner.x + this.owner.width / 2) - (this.x + this.width / 2);
    const distY = (this.owner.y + this.owner.height / 2) - (this.y + this.height / 2);
    const distSum = Math.abs(distX) + Math.abs(distY);
    const dist = Math.sqrt(Math.pow(distX, 2) + Math.pow(distY, 2));
    if (dist > 100) {
        this.x += (distX / distSum) * this.speed;
        this.y += (distY / distSum) * this.speed;
    }
    // map.handleCollision(this);
}
function toggleDebug(this: Companion) {
    this.isDebugOn = !this.isDebugOn;
    const debug: any = this.div.getElementsByClassName("debug")[0];
    if (this.isDebugOn) {
        debug.style.display = "block";
        this.div.style.border = "2px solid black";
    }
    else {
        debug.style.display = "none";
        this.div.style.border = "none";
    }
}
function debug(this: Companion, map: Map) {
    this.div.getElementsByClassName("debug")[0].innerHTML =
        `(${Math.trunc(this.x)}, ${Math.trunc(this.y)})</br>${map.positionInGrid(this.x, this.y)}`;
}

// Companion.div.style.display = "none";