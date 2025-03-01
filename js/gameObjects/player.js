import { Map } from "./map.js";
import { Npcs } from "./npc's.js";

const character = document.getElementById("character")
const Direction = { up: "up", down: "down", left: "left", right: "right", };
export const Player = {
    div: document.getElementById("character"),
    x: character.offsetLeft,
    y: character.offsetTop,
    width: character.clientWidth,
    height: character.clientHeight,
    speed: character.clientWidth,
    direction: Direction.down,
    hasCompanion: true,
    isDebugOn: false,

    update() {
        this.div.style.left = `${this.x}px`;
        this.div.style.top = `${this.y}px`;
        this.interact();
        if (this.isDebugOn) {
            this.debug();
        }
    },
    moveUp() {
        this.direction = Direction.up;
        this.moveY();
    },
    moveDown() {
        this.direction = Direction.down;
        this.moveY();
    },
    moveLeft() {
        this.direction = Direction.left;
        this.moveX();
    },
    moveRight() {
        this.direction = Direction.right;
        this.moveX();
    },
    moveX() {
        let tempX
        if (this.direction === Direction.left) {
            tempX = this.x - this.speed;
            if (tempX < 0) {
                return;
            }
        }
        else if (this.direction === Direction.right) {
            tempX = this.x + this.speed;
            if (tempX + this.width > Map.width) {
                return;
            }
        }
        if (!Map.collisionTiles.includes(Map.layerData[(Map.positionInGrid(tempX, this.y))])) {
            this.x = tempX;
        }
    },
    moveY() {
        let tempY;
        if (this.direction === Direction.up) {
            tempY = this.y - this.speed;
            if (tempY < 0) {
                return;
            }
        }
        else if (this.direction === Direction.down) {
            tempY = this.y + this.speed;
            if (tempY + this.height > Map.height) {
                return;
            }
        }
        if (!Map.collisionTiles.includes(Map.layerData[(Map.positionInGrid(this.x, tempY))])) {
            this.y = tempY;
        }
    },
    interact(object){
      const distX = (this.x + this.width /2) - (object.x + object.width/2);
      const distY = (this.y + this.width/2) - (object.x + object.height/2);
      const dist = Math.sqrt(Math.pow(distX,2) + Math.pow(fistY,2));
      if(dist < Map.tileWidth){
        
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