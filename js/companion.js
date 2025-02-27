import { Map } from "./map.js";
import { Player } from "./player.js";
const companion = document.getElementById("companion");
export const Companion = {
    div: companion,
    x: companion.offsetLeft,
    y: companion.offsetTop,
    width: companion.clientWidth,
    height: companion.clientHeight,

    isDebugOn: false,

    update() {
        this.move();
        this.div.style.left = `${this.x}px`;
        this.div.style.top = `${this.y}px`;
        if(this.isDebugOn){
            this.debug();
        }
    },
    move() {
        const distX = Player.x - this.x;
        const distY = Player.y - this.y;
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
    toggleDebug(){
            this.isDebugOn = !this.isDebugOn;
            if(this.isDebugOn){
                this.div.getElementsByClassName("debug")[0].style.display = "block";
            }
            else{
                this.div.getElementsByClassName("debug")[0].style.display = "none";
            }    
        },
        debug() {
            this.div.getElementsByClassName("debug")[0].innerHTML =
            `(${this.x}, ${this.y})</br>${Map.positionInGrid(this.x, this.y)}`;
        },
}