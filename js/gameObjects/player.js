// // import { Map } from "./map.js";
// import { Npcs } from "./npc's.js";
// import { Companion } from "./companion.js";
// // import { Pokemon } from "./pokemon.js";
// import { openBattleEvent, closeBattleEvent, openCaptureEvent, closeCaptureEvent } from "../backpack.js";

import { createCompanion } from "./companion.js";

let pokemonList;
const Direction = {
    down: { index: 0, direction: "front" },
    left: { index: 1, direction: "left" },
    right: { index: 2, direction: "right" },
    up: { index: 3, direction: "back" },
};

export function createPlayer() {
    const character = document.getElementById("character");
    character.style.backgroundImage = `url(${"../../images/characters/player2Sprites.png"})`;
    const player = {
        div: character,
        x: character.offsetLeft,
        y: character.offsetTop,
        width: character.clientWidth,
        height: character.clientHeight,
        speed: 20,//character.clientWidth,
        isMovingUp: false,
        isMovingDown: false,
        isMovingLeft: false,
        isMovingRight: false,
        direction: Direction.down,
        prevDirection: Direction.down,
        spriteIndex: 0,
        hasCompanion: false,
        companion: undefined,
        capturedPokemon: [],
        isInBattle: false,
        isInEvent: false,
        isDebugOn: false,

        update,
        moveUp,
        moveRight,
        moveDown,
        moveLeft,
        move,
        handleMapCollision,
        setDirection,
        setCompanion,
        removeCompanion,
        releasePokemon,
        interact,

        toggleDebug,
        debug,
    }
    player.companion = createCompanion(player);
    return player;
}

function update(map) {
    this.move(map);
    this.div.style.left = `${this.x}px`;
    this.div.style.top = `${this.y}px`;
    if (this.hasCompanion) {
        Companion.update(map);
    }
    if (this.isDebugOn) {
        this.debug(map);
    }
}

// movement
function moveUp(isMoving) {
    this.isMovingUp = isMoving;
    if (!isMoving) { this.spriteIndex = 0 
        this.div.style.backgroundPositionX = `0px`;
    }
}
function moveDown(isMoving) {
    this.isMovingDown = isMoving;
    if (!isMoving) { this.spriteIndex = 0 
        this.div.style.backgroundPositionX = `0px`;
    }
}
function moveLeft(isMoving) {
    this.isMovingLeft = isMoving;
    if (!isMoving) { this.spriteIndex = 0 
        this.div.style.backgroundPositionX = `0px`;
    }
}
function moveRight(isMoving) {
    this.isMovingRight = isMoving;
    if (!isMoving) { this.spriteIndex = 0 
        this.div.style.backgroundPositionX = `0px`;
    }
}
function move(map) {
    let newX = this.x;
    let newY = this.y;
    if (this.isMovingRight) {
        newX += this.speed;
        this.setDirection(Direction.right);
    }
    else if (this.isMovingLeft) {
        newX -= this.speed;
        this.setDirection(Direction.left);
    }
    else if (this.isMovingUp) {
        newY -= this.speed;
        this.setDirection(Direction.up);
    }
    else if (this.isMovingDown) {
        newY += this.speed;
        this.setDirection(Direction.down);
    }
    this.x = newX;
    this.y = newY;
    this.handleMapCollision(map)
    map.centerMap(this);
    // }
}
function handleMapCollision(map) {
    const hitbox = [
        { x: this.x, y: this.y },
        { x: this.x + this.width, y: this.y },
        { x: this.x, y: this.y + this.width },
        { x: this.x + this.width, y: this.y + this.height }];
    let tileId;
    let tileBounderies;
    if (this.direction === Direction.up) {
        tileId = map.positionInGrid(hitbox[0].x, hitbox[0].y);
        if (map.collisionTiles.includes(map.layerData[tileId])) {
            tileBounderies = map.positionInWorld(tileId);
            if (hitbox[0].y < tileBounderies.y + tileBounderies.height && hitbox[1].y < tileBounderies.y + tileBounderies.height) {
                this.y = tileBounderies.y + tileBounderies.height + 1;
            }
        }
        tileId = map.positionInGrid(hitbox[1].x, hitbox[1].y);
        if (map.collisionTiles.includes(map.layerData[tileId])) {
            tileBounderies = map.positionInWorld(tileId);
            if (hitbox[0].y < tileBounderies.y + tileBounderies.height && hitbox[1].y < tileBounderies.y + tileBounderies.height) {
                this.y = tileBounderies.y + tileBounderies.height + 1;
            }
        }
    }
    if (this.direction === Direction.down) {
        tileId = map.positionInGrid(hitbox[2].x, hitbox[2].y);
        if (map.collisionTiles.includes(map.layerData[tileId])) {
            tileBounderies = map.positionInWorld(tileId);
            if (hitbox[2].y > tileBounderies.y && hitbox[3].y > tileBounderies.y) {
                this.y = tileBounderies.y - this.height - 1;
            }
        }
        tileId = map.positionInGrid(hitbox[3].x, hitbox[3].y);
        if (map.collisionTiles.includes(map.layerData[tileId])) {
            tileBounderies = map.positionInWorld(tileId);
            if (hitbox[2].y > tileBounderies.y && hitbox[3].y > tileBounderies.y) {
                this.y = tileBounderies.y - this.height - 1;
            }
        }
    }
    if (this.direction === Direction.left) {
        tileId = map.positionInGrid(hitbox[0].x, hitbox[0].y);
        if (map.collisionTiles.includes(map.layerData[tileId])) {
            tileBounderies = map.positionInWorld(tileId);
            if (hitbox[0].x < tileBounderies.x + tileBounderies.width && hitbox[2].x < tileBounderies.x + tileBounderies.width) {
                this.x = tileBounderies.x + tileBounderies.width + 1;
            }
        }
        tileId = map.positionInGrid(hitbox[2].x, hitbox[2].y);
        if (map.collisionTiles.includes(map.layerData[tileId])) {
            tileBounderies = map.positionInWorld(tileId);
            if (hitbox[0].x < tileBounderies.x + tileBounderies.width && hitbox[2].x < tileBounderies.x + tileBounderies.width) {
                this.x = tileBounderies.x + tileBounderies.width + 1;
            }
        }
    }
    if (this.direction === Direction.right) {
        tileId = map.positionInGrid(hitbox[1].x, hitbox[1].y);
        if (map.collisionTiles.includes(map.layerData[tileId])) {
            tileBounderies = map.positionInWorld(tileId);
            if (hitbox[1].x > tileBounderies.x && hitbox[3].x > tileBounderies.x) {
                this.x = tileBounderies.x - this.width - 1;
            }
        }
        tileId = map.positionInGrid(hitbox[3].x, hitbox[3].y);
        if (map.collisionTiles.includes(map.layerData[tileId])) {
            tileBounderies = map.positionInWorld(tileId);
            if (hitbox[1].x > tileBounderies.x && hitbox[3].x > tileBounderies.x) {
                this.x = tileBounderies.x - this.width - 1;
            }
        }
    }
}
function setDirection(direction) {
    this.direction = direction;
    if (this.prevDirection != this.direction) {
        this.prevDirection = this.direction;
        this.div.style.backgroundPositionY = `${this.direction.index * -52}px`
        this.div.style.backgroundPositionX = `0px`;
        this.spriteIndex = 0;
    }
    else {
        this.spriteIndex = (this.spriteIndex + .3) % 4;
        this.div.style.backgroundPositionX = `${Math.trunc(this.spriteIndex) * -52}px`;
    }
}
function isColliding(map, x, y) {
    if (map.collisionTiles.includes(map.layerData[map.positionInGrid(x, y)])) {
        return true;
    }
}
// function moveUp() {
//     this.direction = Direction.up;
//     const tempY = this.y - this.speed;
//     if (!(tempY < 0)) {
//         this.move(this.x, tempY);
//     }
// }
// function moveDown() {
//     this.direction = Direction.down;
//     const tempY = this.y + this.speed;
//     if (!(tempY + this.height > Map.height)) {
//         this.move(this.x, tempY);
//     }
// }
// function moveLeft() {
//     this.direction = Direction.left;
//     const tempX = this.x - this.speed;
//     if (!(tempX < 0)) {
//         this.move(tempX, this.y);
//     }
// }
// function moveRight() {
//     this.direction = Direction.right;
//     const tempX = this.x + this.speed;
//     if (!(tempX + this.width > Map.width)) {
//         this.move(tempX, this.y);
//     }
// }
// function move(newX, newY) {
//     const playerPos = Map.positionInGrid(newX, newY);
//     const tileId = Map.layerData[(playerPos)];
//     let isOnNpc;
//     Npcs.npcsActive.forEach((npc) => {
//         if (playerPos === Map.positionInGrid(npc.x, npc.y)) {
//             isOnNpc = true;
//         }
//     })
//     let isOnPokemon;
//     if (Pokemon.isActive) {
//         isOnPokemon = playerPos === Map.positionInGrid(Pokemon.x, Pokemon.y);
//     }
//     const isOnCompanion = playerPos === Map.positionInGrid(this.companion.x, this.companion.y);
//     const isOnCollisionTile = Map.collisionTiles.includes(tileId);
//     if (!isOnCollisionTile && !isOnNpc && !isOnPokemon && !isOnCompanion) {
//         this.x = newX;
//         this.y = newY;
//     }
//     if (tileId === 32) {
//         const rand = Math.trunc(Math.random() * 10);
//         if (rand === 0) {
//             const pokemon = pokemonList[Math.trunc(Math.random() * pokemonList.length)];
//             battle(pokemon)
//         }
//     }
// }

//pokemon
function setCompanion(pokemon) {
    if (Player.capturedPokemon.includes(pokemon)) {
        this.hasCompanion = true;
        Companion.setCompanion(pokemon);
        document.getElementById("nav-pokemon").src = Companion.pokemon.sprites["front_default"]
    }
    else {
        alert("je hebt deze pokemon nog niet gevangen")
    }
}
function removeCompanion() {
    this.hasCompanion = false;
    Companion.removeCompanion();
    document.getElementById("nav-pokemon").src = "../images/pikachu_silouhette.png"
}
function releasePokemon(pokemon) {
    if (pokemon === this.companion.pokemon) {
        alert("kies eerst een andere companion");
    }
    else if (!this.capturedPokemon.includes(pokemon)) {
        alert("je hebt deze pokemon niet gevangen");
    }
    else {
        alert(`je hebt ${pokemon.name} losgelaten`);
        const pokemonIdx = Player.capturedPokemon.indexOf(pokemon);
        Player.capturedPokemon.splice(pokemonIdx, 1);
    }
}

//debug
function toggleDebug() {
    this.isDebugOn = !this.isDebugOn;
    if (this.isDebugOn) {
        this.div.getElementsByClassName("debug")[0].style.display = "block";
    }
    else {
        this.div.style.backgroundColor = "none";
        this.div.getElementsByClassName("debug")[0].style.display = "none";
    }
    this.companion.toggleDebug();
}
function debug(map) {
    this.div.style.backgroundColor = "red";
    this.div.getElementsByClassName("debug")[0].innerHTML =
        `(${this.x}, ${this.y})</br>${map.positionInGrid(this.x, this.y)}`;
}




//interact
function interact() {
    if (interactNpc()) {
        return;
    }
    if (interactPokemon()) {
        return;
    }
}
function interactNpc() {
    Npcs.npcsActive.forEach((npc) => {
        const distX = (Player.x + Player.width / 2) - (npc.x + npc.width / 2);
        const distY = (Player.y + Player.height / 2) - (npc.y + npc.height / 2);
        const dist = Math.sqrt(Math.pow(distX, 2) + Math.pow(distY, 2));
        if (dist <= Map.tileWidth * 1) {
            battle(npc.pokemon);
            return true;
        }
    });
}
function interactPokemon() {
    if (Pokemon.isActive) {
        const distX = (Player.x + Player.width / 2) - (Pokemon.x + Pokemon.width / 2);
        const distY = (Player.y + Player.height / 2) - (Pokemon.y + Pokemon.height / 2);
        const dist = Math.sqrt(Math.pow(distX, 2) + Math.pow(distY, 2));
        if (dist <= Map.tileWidth * 1) {
            capture(Pokemon.pokemon);
            return true;
        }
    }
}

// ========================================== //
// ================ battle ================== //
// ========================================== //

const battleButtons = document.getElementsByClassName("battle_button");
let battleActions = -1;
for (let i = 0; i < battleButtons.length; i++) {
    battleButtons[i].addEventListener("click", (e) => {
        if (Player.isInBattle) {
            if (!isBattleTextOn) {
                battleActions = i;
            }
        }
    })
}
let isBattleTextOn = false;
function setBattleMsg(text) {
    const battleTextBox = document.getElementById("battle_text");
    const battleContinueText = battleTextBox.lastElementChild;
    isBattleTextOn = true;
    let i = 0;
    const intervalId = setInterval(() => {
        if (i < text.length) {
            i++;
            battleTextBox.children[0].innerHTML = text.substring(0, i);
        }
        else if (i === text.length) {
            i++;
            battleContinueText.style.display = "block";
        }
    }, 30);
    document.body.addEventListener("click", () => {
        clearInterval(intervalId);
        battleTextBox.children[0].innerHTML = "";
        battleContinueText.style.display = "none"
        isBattleTextOn = false;
    }, { once: true });
}
function battle(pokemon) {
    if (!Player.hasCompanion) {
        alert("je hebt nog geen pokemon om mee te vechten")
        return;
    }
    Player.isInBattle = true
    let isBattling = true;
    let battleText;
    const stage = openBattleEvent();

    let isMyTurn = true;
    const playerObject = stage[0];
    const playerMaxHp = Player.companion.pokemon.stats[0]["base_stat"];
    let playerHp = playerMaxHp;
    let playerHpPercent;

    const enemyObject = stage[1];
    let enemyMaxHp = pokemon.stats[0]["base_stat"];
    let enemyHp = enemyMaxHp;
    let enemyHpPercent;

    playerObject.name.innerHTML = Player.companion.pokemon.name;
    playerObject.hp.innerHTML = `${playerHp}HP`;
    playerObject.img.src = Player.companion.pokemon.sprites["back_default"];
    playerObject.hpBar.style.background = `linear-gradient(to right, #00ff00 100%, #000000 100%)`;
    enemyObject.name.innerHTML = pokemon.name;
    enemyObject.hp.innerHTML = `${enemyHp}HP`;
    enemyObject.hpBar.style.background = `linear-gradient(to right, #00ff00 100%, #000000 100%)`;
    enemyObject.img.src = pokemon.sprites["front_default"];


    const intervalId = setInterval(() => {
        if (!isBattleTextOn) {
            if (!isBattling) {
                clearInterval(intervalId);
                closeBattleEvent();
                Player.isInBattle = false;
                Player.isInEvent = false;
                if (enemyHp === 0 && !pokemon.is_captured) {
                    capture(pokemon);
                }
                return;
            }
            if (enemyHp === 0) {
                setBattleMsg("Je hebt gewonnen")
                Player.companion.pokemon.stats[6].base_stat++;
                isBattling = false;
                return
            }
            if (playerHp === 0) {
                setBattleMsg("Je hebt verloren")
                Player.companion.pokemon.stats[7].base_stat++;
                isBattling = false;
                return;
            }
            if (isMyTurn) {
                battleText = Player.companion.pokemon.name + " ";
                if (battleActions === 0) {
                    const dmg = Math.max(0, Player.companion.pokemon.stats[1]["base_stat"] - pokemon.stats[2]["base_stat"]);
                    enemyHp = Math.max(0, enemyHp - dmg);

                    battleText += `valt aan met een normal attack en doet ${dmg} schade`;
                    isMyTurn = false;
                }
                if (battleActions === 1) {
                    const dmg = Math.max(0, Player.companion.pokemon.stats[3]["base_stat"] - pokemon.stats[4]["base_stat"]);
                    enemyHp = Math.max(0, enemyHp - dmg);

                    battleText += `valt aan met een special attack en doet ${dmg} schade`;
                    isMyTurn = false;
                }
                if (battleActions === 2) {
                    battleText += `loopt weg`;
                    setBattleMsg(battleText);

                    isBattling = false;

                }
                if (!isMyTurn) {
                    enemyHpPercent = enemyHp / enemyMaxHp * 100;
                    enemyObject.hp.innerHTML = `${enemyHp}HP`;
                    enemyObject.hpBar.style.background = `linear-gradient(to right, #00ff00 ${enemyHpPercent}%, #000000 ${enemyHpPercent}%)`;
                    setBattleMsg(battleText);
                }
                battleActions = -1;
            }
            else {
                battleText = pokemon.name + " ";
                const rand = Math.round(Math.random())
                if (rand === 0) {
                    const dmg = Math.max(0, pokemon.stats[1]["base_stat"] - Player.companion.pokemon.stats[2]["base_stat"]);
                    playerHp = Math.max(0, playerHp - dmg);

                    battleText += `valt aan met een normal attack en doet ${dmg} schade`;
                }
                if (rand === 1) {
                    const dmg = Math.max(0, pokemon.stats[3]["base_stat"] - Player.companion.pokemon.stats[4]["base_stat"]);
                    playerHp = Math.max(0, playerHp - dmg);

                    battleText += `valt aan met een special attack en doet ${dmg} schade`;
                }
                playerHpPercent = playerHp / playerMaxHp * 100;
                playerObject.hp.innerHTML = `${playerHp}HP`;
                playerObject.hpBar.style.background = `linear-gradient(to right, #00ff00 ${playerHpPercent}%, #000000 ${playerHpPercent}%)`
                setBattleMsg(battleText);
                isMyTurn = true;
            }
        }
    }, 45)
}

// ========================================== //
// ================ capture ================= //
// ========================================== //

function capture(pokemon) {
    const stage = openCaptureEvent();
    stage.name.innerHTML = pokemon.name;
    stage.img.src = pokemon.sprites["front_default"];
    stage.nickNameDiv.style.display = "none";
    let hasPokemon = Player.capturedPokemon.includes(pokemon);
    let chances = 3;
    for (let i = 0; i < stage.chances.children.length; i++) {
        stage.chances.children[i].style.filter = "grayscale(0%)";
    }
    const captureChance = (50 - pokemon.stats[2]["base_stat"] + (Player.hasCompanion ? Player.companion.pokemon.stats[1]["base_stat"] : 0)) / 100;
    if (hasPokemon) {
        stage.button.style.border = "3px solid green";
    }
    else {
        stage.button.style.border = "3px solid red";
    }

    let isCaptureBtnPressed = false;
    const captureBtn = document.getElementById("capture_button");
    captureBtn.addEventListener("click", () => {
        isCaptureBtnPressed = true;
    })

    const intervalId = setInterval(() => {
        if (isCaptureBtnPressed) {
            isCaptureBtnPressed = false;
            if (hasPokemon) {
                Player.releasePokemon(pokemon);
                clearInterval(intervalId);
                closeCaptureEvent();
                Player.isInEvent = false;
            }
            else {
                chances--;
                stage.chances.children[chances].style.filter = "grayscale(100%)";
                const rand = Math.random();
                if (rand <= captureChance) {
                    Player.capturedPokemon.push(pokemon);
                    pokemon.is_known = true;
                    hasPokemon = true;
                    chances = 0;
                }
                if (chances === 0) {
                    if (hasPokemon) {
                        alert(`je hebt ${pokemon.name} gevangen`);
                        const input = stage.nickNameDiv.getElementsByTagName("input")[0];
                        input.value = "";
                        stage.nickNameDiv.style.display = "block";
                        stage.nickNameDiv.getElementsByTagName("button")[0].addEventListener("click", () => {
                            pokemon.nickname = input.value;
                            closeCaptureEvent();
                            Player.isInEvent = false;
                        });
                    }
                    else {
                        alert(`${pokemon.name} is ontsnapt`);
                        closeCaptureEvent();
                        Player.isInEvent = false;
                    }
                    clearInterval(intervalId);

                }
            }
        }
    }, 45)
}
