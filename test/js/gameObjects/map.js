import mapData from "./map.json"  with { type: "json" };
import { Direction } from "./player.js";
// import { Pokemon } from "./pokemon.js";

export function createMap() {
    const overworldMap = document.getElementById("overworldMap");
    overworldMap.style.width = `${mapData["width"] * 50}px`;
    overworldMap.style.height = `${mapData["height"] * 50}px`;
    overworldMap.style.backgroundSize = overworldMap.style.width

    const map = {
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
        npcs: [],
        pokemon: [],

        update,
        addObject,
        centerMap,
        positionInGrid,
        positionInWorld,
        isOnScreen,
        getPositionOnScreen,
        getPositionOffScreen,
        handleCollision,

    }
    return map
}

function update(player) {
    this.div.style.left = `${this.x}px`;
    this.div.style.top = `${this.y}px`;
    this.npcs.forEach(npc => {
        npc.update(this);
    });
    this.pokemon.forEach((pokemon) => {
        pokemon.update(this, player);
    });
}
function addObject(object) {
    this.div.appendChild(object.div);
    object.width = object.div.clientWidth;
    object.height = object.div.clientHeight;
    if (object.type === "npc") {
        this.npcs.push(object);
    }
    else if (object.type === "pokemon") {
        this.pokemon.push(object);
    }
}
function centerMap(target) {
    let playerCenterXLeft = -((target.x + target.width / 2) - (this.left + window.innerWidth) / 2) - (window.innerWidth / 2) * 0.3;
    let playerCenterXRight = -((target.x + target.width / 2) - (this.left + window.innerWidth) / 2) + (window.innerWidth / 2) * 0.3;
    let playerCenterYLeft = -((target.y + target.height / 2) - (this.top + window.innerHeight) / 2) - (window.innerHeight / 2) * 0.3;
    let playerCenterYRight = -((target.y + target.height / 2) - (this.top + window.innerHeight) / 2) + (window.innerHeight / 2) * 0.3;
    let maxScrollwidth = -(this.width - window.innerWidth);
    let maxScrollHeihgt = -(this.height - window.innerHeight);
    if (this.x < playerCenterXLeft) {
        this.x = Math.min(this.left, Math.max(playerCenterXLeft, maxScrollwidth));
    }
    if (this.x > playerCenterXRight) {
        this.x = Math.min(this.left, Math.max(playerCenterXRight, maxScrollwidth));
    }
    if (this.y < playerCenterYLeft) {
        this.y = Math.min(this.top, Math.max(playerCenterYLeft, maxScrollHeihgt));
    }
    if (this.y > playerCenterYRight) {
        this.y = Math.min(this.top, Math.max(playerCenterYRight, maxScrollHeihgt));
    }
}
function positionInGrid(x, y) {
    return Math.trunc(x / this.tileWidth) + Math.trunc(y / this.tileHeight) * mapData["width"];
}
function positionInWorld(index) {
    let x = (index % (mapData["width"])) * this.tileWidth;
    let y = (Math.trunc(index / mapData["width"])) * this.tileHeight;
    let width = this.tileWidth;
    let height = this.tileHeight;
    return { x, y, width, height };
}
function isOnScreen(x, y, width = 0, height = 0) {
    if (-this.x + this.left < x + width && x < -this.x + window.innerWidth &&
        -this.y + this.top < y + height && y < -this.y + window.innerHeight) {
        return true;
    }
    return false;
}
function getPositionOnScreen() {
    const leftBorder = -this.x + this.left;
    const rightBorder = -this.x + window.innerWidth;
    const upperborder = -this.y + this.top;
    const lowerBorder = -this.y + window.innerHeight;
    let tileId;
    let posInGrid;
    do {
        const x = Math.trunc(leftBorder + Math.random() * (rightBorder - leftBorder));
        const y = Math.trunc(upperborder + Math.random() * (lowerBorder - upperborder));
        posInGrid = this.positionInGrid(x, y);
        tileId = this.layerData[posInGrid];
    } while (this.collisionTiles.includes(tileId));
    return this.positionInWorld(posInGrid);
}
function getPositionOffScreen() {
    const leftBorder = -this.x + this.left;
    const rightBorder = -this.x + window.innerWidth;
    const upperborder = -this.y + this.top;
    const lowerBorder = -this.y + window.innerHeight;
    let tileId;
    let posInGrid;
    let x;
    let y;
    do {
        x = Math.trunc(this.left + Math.random() * (this.width - this.left));
        y = Math.trunc(this.top + Math.random() * (this.height - this.top));
        posInGrid = this.positionInGrid(x, y);
        tileId = this.layerData[posInGrid];
    } while (this.collisionTiles.includes(tileId) ||
       (( leftBorder < x && x < rightBorder) && (upperborder < y && y < lowerBorder)));
    return this.positionInWorld(posInGrid);
}
function handleCollision(player) {
    const hitbox = [
        { x: player.x, y: player.y },
        { x: player.x + player.width - 1, y: player.y },
        { x: player.x, y: player.y + player.height - 1 },
        { x: player.x + player.width - 1, y: player.y + player.height - 1 }];
    let tileId = [];
    hitbox.forEach((coor) => {
        tileId.push(this.positionInGrid(coor.x, coor.y));
    })
    let tileBounderies;
    if (player.direction.includes(Direction.up)) {
        if (this.collisionTiles.includes(this.layerData[tileId[0]])) {
            tileBounderies = this.positionInWorld(tileId[0]);
            if (hitbox[0].y < tileBounderies.y + tileBounderies.height && hitbox[1].y < tileBounderies.y + tileBounderies.height) {
                player.y = tileBounderies.y + tileBounderies.height;
            }
        }
        if (this.collisionTiles.includes(this.layerData[tileId[1]])) {
            tileBounderies = this.positionInWorld(tileId[1]);
            if (hitbox[0].y < tileBounderies.y + tileBounderies.height && hitbox[1].y < tileBounderies.y + tileBounderies.height) {
                player.y = tileBounderies.y + tileBounderies.height;
            }
        }
    }
    if (player.direction.includes(Direction.down)) {
        if (this.collisionTiles.includes(this.layerData[tileId[2]])) {
            tileBounderies = this.positionInWorld(tileId[2]);
            if (hitbox[2].y > tileBounderies.y && hitbox[3].y > tileBounderies.y) {
                player.y = tileBounderies.y - player.height;
            }
        }
        if (this.collisionTiles.includes(this.layerData[tileId[3]])) {
            tileBounderies = this.positionInWorld(tileId[3]);
            if (hitbox[2].y > tileBounderies.y && hitbox[3].y > tileBounderies.y) {
                player.y = tileBounderies.y - player.height;
            }
        }
    }
    if (player.direction.includes(Direction.left)) {
        if (this.collisionTiles.includes(this.layerData[tileId[0]])) {
            tileBounderies = this.positionInWorld(tileId[0]);
            if (hitbox[0].x < tileBounderies.x + tileBounderies.width && hitbox[2].x < tileBounderies.x + tileBounderies.width) {
                player.x = tileBounderies.x + tileBounderies.width;
            }
        }
        if (this.collisionTiles.includes(this.layerData[tileId[2]])) {
            tileBounderies = this.positionInWorld(tileId[2]);
            if (hitbox[0].x < tileBounderies.x + tileBounderies.width && hitbox[2].x < tileBounderies.x + tileBounderies.width) {
                player.x = tileBounderies.x + tileBounderies.width;
            }
        }
    }
    if (player.direction.includes(Direction.right)) {
        if (this.collisionTiles.includes(this.layerData[tileId[1]])) {
            tileBounderies = this.positionInWorld(tileId[1]);
            if (hitbox[1].x > tileBounderies.x && hitbox[3].x > tileBounderies.x) {
                player.x = tileBounderies.x - player.width;
            }
        }
        if (this.collisionTiles.includes(this.layerData[tileId[3]])) {
            tileBounderies = this.positionInWorld(tileId[3]);
            if (hitbox[1].x > tileBounderies.x && hitbox[3].x > tileBounderies.x) {
                player.x = tileBounderies.x - player.width;
            }
        }
    }
}
// function Debug() {
//     document.getElementById("mapCoor").innerHTML =
//         `overworld map: (${overworldMap.style.left} function ${overworldMap.style.top})`;
// }
// Map.div?.appendChild(Pokemon.div);