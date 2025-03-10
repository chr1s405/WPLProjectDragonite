import { Map } from "./map.js";
import { Player } from "./player.js";
const companionDiv = document.getElementById("companion");
export const Companion = {
    div: companionDiv,
    x: 0,
    y: 0,
    width: companionDiv.clientWidth,
    height: companionDiv.clientHeight,
    pokemon: undefined,

    isDebugOn: false,

    getCompanion(pokemon){
        this.x = Player.x + 50;
        this.y = Player.y;
        this.pokemon = pokemon;
        this.div.style.display = "block";
        this.div.style.backgroundImage = `url(${pokemon.sprites["front_default"]})`
    },
    removeCompanion(){
        this.pokemon = undefined;
        this.div.style.display = "none";
    },
    update() {
        this.move();
        this.div.style.left = `${this.x}px`;
        this.div.style.top = `${this.y}px`;
        if (this.isDebugOn) {
            this.debug();
        }
    },
    move() {
        const distX = (Player.x + Player.width / 2) - (this.x + this.width / 2);
        const distY = (Player.y + Player.height / 2) - (this.y + this.height / 2);
        const dist = Math.sqrt(Math.pow(distX, 2) + Math.pow(distY, 2));
        if (dist > 100) {
            if (Math.abs(distX) > 20) {
                this.x += (distX / (distX != 0 ? Math.abs(distX) : 1)) * 50;
            }
            if (Math.abs(distY) > 20) {
                this.y += (distY / (distY != 0 ? Math.abs(distY) : 1)) * 50;
            }
        }
    },
    toggleDebug() {
        this.isDebugOn = !this.isDebugOn;
        if (this.isDebugOn) {
            this.div.getElementsByClassName("debug")[0].style.display = "block";
        }
        else {
            this.div.getElementsByClassName("debug")[0].style.display = "none";
        }
    },
    debug() {
        this.div.getElementsByClassName("debug")[0].innerHTML =
            `(${this.x}, ${this.y})</br>${Map.positionInGrid(this.x, this.y)}`;
    },
}
Companion.div.style.display = "none";