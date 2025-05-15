import mapData from "./map.json"  with { type: "json" };
import { createNpc } from "./npc's.js";
import { createPokemon } from "./pokemon.js";

export function createMap(npcs) {
    const overworldMap = document.getElementById("overworldMap");

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
        pokemonSpawnTime: 400,
        pokemonSpawnTimer: 0,

        update,
        addObject,
        centerMap,
        positionInGrid,
        positionInWorld,
        isOnScreen,
        getPosition,
        getRandomPosition,
        getPositionOnScreen,
        getPositionOffScreen,
        handleCollision,
        findPath,

    }
    overworldMap.style.width = `${map.width}px`;
    overworldMap.style.height = `${map.height}px`;
    overworldMap.style.backgroundSize = overworldMap.style.width;

    npcs.forEach((npc) => {
        const npcObj = createNpc(this, npc)
        map.npcs.push(npcObj);
        map.addObject(npcObj);
    })
    return map
}

function update(player) {
    this.div.style.left = `${this.x}px`;
    this.div.style.top = `${this.y}px`;
    this.npcs.forEach(npc => {
        npc.update(this);
    });
    this.pokemon.forEach((pokemon, index) => {
        pokemon.update(this, player);
        if (pokemon.isDead) {
            this.pokemon.splice(index, 1);
        }
    });
    this.pokemonSpawnTimer++;
    if (this.pokemonSpawnTimer > this.pokemonSpawnTime) {
        this.pokemonSpawnTimer = 0;
        const posOnScreen = this.getPositionOnScreen();
        const spawnPos = this.getRandomPosition(posOnScreen.x, posOnScreen.y, 10000)
        const pokemonObj = createPokemon(this, spawnPos.x, spawnPos.y);
        this.pokemon.push(pokemonObj);
        this.addObject(pokemonObj);
    }
}
function addObject(object) {
    this.div.appendChild(object.div);
    object.width = object.div.clientWidth;
    object.height = object.div.clientHeight;
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
function getPosition(left = this.left, top = this.top, right = this.width, bottom = this.height) {
    let tileId;
    do {
        const x = Math.trunc(left + Math.random() * (right - left));
        const y = Math.trunc(top + Math.random() * (bottom - top));
        tileId = this.positionInGrid(x, y);
    } while (this.collisionTiles.includes(this.layerData[tileId]));
    return this.positionInWorld(tileId);
}
function getRandomPosition(x, y, radius) {
    const left = Math.max(this.left, x - radius);
    const right = Math.min(this.width, x + radius);
    const top = Math.max(this.top, y - radius);
    const bottom = Math.min(this.height, y + radius);
    return this.getPosition(left, top, right, bottom);
}
function getPositionOnScreen() {
    const left = -this.x + this.left;
    const right = -this.x + window.innerWidth;
    const top = -this.y + this.top;
    const bottom = -this.y + window.innerHeight;
    return this.getPosition(left, top, right, bottom);
}
function getPositionOffScreen() {
    const left = -this.x + this.left;
    const right = -this.x + window.innerWidth;
    const top = -this.y + this.top;
    const bottom = -this.y + window.innerHeight;
    let pos;
    do {
        pos = this.getPosition();
    } while ((left < pos.x && pos.x < right) && (top < pos.y && pos.y < bottom));
    return pos;
}
function handleCollision(player) {
    let hitbox;
    let tiles = [];
    let tileId;
    let tileBounderies;
    let npcHitbox;

    hitbox = {
        x: player.x + player.velocityX,
        y: player.y,
        width: player.width - 1,
        height: player.height - 1,
    }
    tileId = this.positionInGrid(hitbox.x, hitbox.y);
    tiles = [
        (tileId - mapData["width"] - 1), (tileId - mapData["width"]), (tileId - mapData["width"] + 1),
        (tileId - 1), (tileId), (tileId + 1),
        (tileId + mapData["width"] - 1), (tileId + mapData["width"]), (tileId + mapData["width"] + 1)]

    tiles.forEach((tile) => {
        if (this.collisionTiles.includes(this.layerData[tile])) {
            tileBounderies = this.positionInWorld(tile);
            if (isOverlapping(hitbox, tileBounderies)) {
                if (player.velocityX < 0) {
                    player.x = tileBounderies.x + tileBounderies.width;
                }
                if (player.velocityX > 0) {
                    player.x = tileBounderies.x - player.width;
                }
                player.velocityX = 0;
            }
        }
    })
    this.npcs.forEach((npc) => {
        npcHitbox = { x: npc.x, y: npc.y, width: npc.width, height: npc.height };
        if (isOverlapping(hitbox, npcHitbox)) {
            if (player.velocityX < 0) {
                player.x = npcHitbox.x + npcHitbox.width;
            }
            if (player.velocityX > 0) {
                player.x = npcHitbox.x - player.width;
            }
            player.velocityX = 0;
        }
    })

    hitbox = {
        x: player.x,
        y: player.y + player.velocityY,
        width: player.width - 1,
        height: player.height - 1,
    }
    tileId = this.positionInGrid(hitbox.x, hitbox.y);
    tiles = [
        (tileId - mapData["width"] - 1), (tileId - mapData["width"]), (tileId - mapData["width"] + 1),
        (tileId - 1), (tileId), (tileId + 1),
        (tileId + mapData["width"] - 1), (tileId + mapData["width"]), (tileId + mapData["width"] + 1)]

    tiles.forEach((tile) => {
        if (this.collisionTiles.includes(this.layerData[tile])) {
            tileBounderies = this.positionInWorld(tile);
            if (isOverlapping(hitbox, tileBounderies)) {
                if (player.velocityY < 0) {
                    player.y = tileBounderies.y + tileBounderies.height;
                }
                if (player.velocityY > 0) {
                    player.y = tileBounderies.y - player.height;
                }
                player.velocityY = 0;
            }
        }
    })
    this.npcs.forEach((npc) => {
        npcHitbox = { x: npc.x, y: npc.y, width: npc.width, height: npc.height };
        if (isOverlapping(hitbox, npcHitbox)) {
            if (player.velocityY < 0) {
                player.y = npcHitbox.y + npcHitbox.height;
            }
            if (player.velocityY > 0) {
                player.y = npcHitbox.y - player.height;
            }
            player.velocityY = 0;
        }
    })
}

function findPath(start, end) {
    let visited = [start];
    let queue = [[start]];
    let counter = 0
    const maxCount = 9999;
    while (queue.length > 0 && counter++ <= maxCount) {
        const path = queue.shift();
        const current = path[path.length - 1]
        const neighbors = [
            current - 1,
            current + 1,
            current - mapData["width"],
            current + mapData["width"],];
            for(const next of neighbors) {
            if (next === end) {
                return [...path, next];
            }
            else if ((!this.collisionTiles.includes(this.layerData[next])) &&
                (!visited.includes(next)) &&
                (0 < next && next < (mapData["width"] * mapData["height"]))) {
                visited.push(next);
                queue.push([...path, next]);
            }
        }
    }
    return [start];
}

function isOverlapping(square1, square2) {
    return (((square2.x <= square1.x && square1.x < (square2.x + square2.width)) ||
        (square2.x <= (square1.x + square1.width) && (square1.x + square1.width) < (square2.x + square2.width))) &&
        ((square2.y <= square1.y && square1.y < (square2.y + square2.height)) ||
            (square2.y <= (square1.y + square1.height) && (square1.y + square1.height) < (square2.y + square2.height))));

}
// function Debug() {
//     document.getElementById("mapCoor").innerHTML =
//         `overworld map: (${overworldMap.style.left} function ${overworldMap.style.top})`;
// }
// Map.div?.appendChild(Pokemon.div);