import mapData from "./map.json"  with { type: "json" };
import { Player } from "./player.js";

const overworldMap = document.getElementById("overworldMap");
overworldMap.style.width = `${mapData["width"] * 50}px`;
overworldMap.style.height = `${mapData["height"] * 50}px`;
overworldMap.style.backgroundSize = overworldMap.style.width

export const Map = {
    div: overworldMap,
    x: 0,
    y: 0,
    left: overworldMap.offsetLeft,
    top: overworldMap.offsetTop,
    width: mapData["width"] * mapData["tilewidth"],
    height: mapData["height"] * mapData["tileheight"],
    tileWidth: mapData["tilewidth"],
    tileHeight: mapData["tileheight"],
    layerData: mapData["layers"][1]["data"],
    collisionTiles: [1, 2, 3, 11, 13, 21, 22, 23, 5, 6, 7, 15, 16, 17, 25, 26, 27, 31, 51, 52, 53, 61, 62, 63, 71, 72, 73],

    update() {
        this.scrollMap()
        this.div.style.left = `${this.x}px`;
        this.div.style.top = `${this.y}px`;
    },
    scrollMap() {
        let playerCenterX = -((Player.x + Player.width / 2) - (this.left + window.innerWidth) / 2);
        let playerCenterY = -((Player.y + Player.height / 2) - (this.top + window.innerHeight) / 2);
        let maxScrollwidth = -(this.width - window.innerWidth);
        let maxScrollHeihgt = -(this.height - window.innerHeight);
        this.x = Math.min(this.left, Math.max(playerCenterX, maxScrollwidth));
        this.y = Math.min(this.top, Math.max(playerCenterY, maxScrollHeihgt));
    },
    positionInGrid(x, y) {
        return Math.trunc(x / this.tileWidth) + Math.trunc(y / this.tileHeight) * mapData["width"];
    },
    positionInWorld(index) {
        let x = (index % (mapData["width"])) * this.tileWidth;
        let y = (Math.trunc(index / mapData["width"])) * this.tileHeight;
        return { x, y };
    },
    isOnScreen(x, y, width = 0, height = 0) {
        if (-this.x + this.left < x + width && x < -this.x + window.innerWidth &&
            -this.y + this.top < y + height && y < -this.y + window.innerHeight) {
            return true;
        }
        return false
    },
}


// function Debug() {
//     document.getElementById("mapCoor").innerHTML =
//         `overworld map: (${overworldMap.style.left}, ${overworldMap.style.top})`;
// }