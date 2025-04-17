import { createCompanion } from "./companion.js";
import { backpack, customAlert } from "../game.js";
let pokemonList;
export const Direction = {
    down: { index: 0, direction: "front" },
    left: { index: 1, direction: "left" },
    right: { index: 2, direction: "right" },
    up: { index: 3, direction: "back" },
};

export function createPlayer() {
    const character = document.getElementById("character");
    // character.style.backgroundImage = `url(${"../../assets/characters/player2Sprites.png"})`;
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
        direction: [],
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
        handleNotMoving,
        move,
        setDirection,
        drawSprites,
        setCompanion,
        capturePokemon,
        removeCompanion,
        releasePokemon,
        interact,
        interactNpc,
        interactPokemon,
        battle,
        capture,

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
        this.companion.update(map);
    }
    if (this.isDebugOn) {
        this.debug(map);
    }
}

// movement
function moveUp(isMoving) {
    this.isMovingUp = isMoving;
    if (!isMoving) {
        this.handleNotMoving(Direction.up);
    }
}
function moveDown(isMoving) {
    this.isMovingDown = isMoving;
    if (!isMoving) {
        this.handleNotMoving(Direction.down);
    }
}
function moveLeft(isMoving) {
    this.isMovingLeft = isMoving;
    if (!isMoving) {
        this.handleNotMoving(Direction.left);
    }
}
function moveRight(isMoving) {
    this.isMovingRight = isMoving;
    if (!isMoving) {
        this.handleNotMoving(Direction.right);
    }
}
function handleNotMoving(direction) {
    this.spriteIndex = 0
    this.div.style.backgroundPositionX = `0px`;
    const index = this.direction.indexOf(direction);
    if (index !== -1) {
        this.direction.splice(index);
    }
}
function move(map) {
    let newX = this.x;
    let newY = this.y;
    if (this.isMovingRight) {
        newX += this.speed;
        this.setDirection(Direction.right);
    }
    if (this.isMovingLeft) {
        newX -= this.speed;
        this.setDirection(Direction.left);
    }
    if (this.isMovingUp) {
        newY -= this.speed;
        this.setDirection(Direction.up);
    }
    if (this.isMovingDown) {
        newY += this.speed;
        this.setDirection(Direction.down);
    }
    this.x = newX;
    this.y = newY;
    map.handleCollision(this)
    map.centerMap(this);
    this.drawSprites();
    // }
}

function setDirection(direction) {
    if (!this.direction.includes(direction)) {
        this.direction.push(direction);
        this.div.style.backgroundPositionX = `0px`;
        this.spriteIndex = 0;
    }
}
function drawSprites() {
    if (this.direction.length !== 0) {
        this.div.style.backgroundPositionY = `${this.direction[this.direction.length - 1].index * -52}px`
        this.spriteIndex = (this.spriteIndex + .3) % 4;
        this.div.style.backgroundPositionX = `${Math.trunc(this.spriteIndex) * -52}px`;
    }
}

//pokemon
function setCompanion(pokemon) {
    if (this.capturedPokemon.includes(pokemon)) {
        this.hasCompanion = true;
        this.companion.setCompanion(pokemon);
        document.getElementById("nav-pokemon").src = this.companion.pokemon.sprites["front_default"]
    }
    else {
        customAlert("je hebt deze pokemon nog niet gevangen");
    }
}
function removeCompanion() {
    this.hasCompanion = false;
    Companion.removeCompanion();
    document.getElementById("nav-pokemon").src = "../assets/pikachu_silouhette.png"
}
function capturePokemon(pokemon) {
    pokemon.isKnown = true;
    pokemon.isCaptured = true;
    this.capturedPokemon.push(pokemon);
}
function releasePokemon(pokemon) {
    if (pokemon === this.companion.pokemon) {
        customAlert("kies eerst een andere companion");
    }
    else if (!this.capturedPokemon.includes(pokemon)) {
        customAlert("je hebt deze pokemon niet gevangen");
    }
    else {
        customAlert(`je hebt ${pokemon.name} losgelaten`);
        const pokemonIdx = this.capturedPokemon.indexOf(pokemon);
        this.capturedPokemon.splice(pokemonIdx, 1);
        pokemon.isCaptured = false;
    }
}

//debug
function toggleDebug() {
    this.isDebugOn = !this.isDebugOn;
    if (this.isDebugOn) {
        this.div.getElementsByClassName("debug")[0].style.display = "block";
    this.div.style.border = "2px solid black";
    }
    else {
        this.div.getElementsByClassName("debug")[0].style.display = "none";
        this.div.style.border = "none";
    }
    this.companion.toggleDebug();
}
function debug(map) {
    this.div.getElementsByClassName("debug")[0].innerHTML =
        `(${this.x}, ${this.y})</br>${map.positionInGrid(this.x, this.y)}`;
}




//interact
function interact(map) {
    if (this.interactNpc(map)) {
        return;
    }
    if (this.interactPokemon(map)) {
        return;
    }
}
function interactNpc(map) {
    map.npcs.forEach(npc => {
        if (npc.isOnScreen) {
            const distX = (this.x + this.width / 2) - (npc.x + npc.width / 2);
            const distY = (this.y + this.height / 2) - (npc.y + npc.height / 2);
            const dist = Math.sqrt(Math.pow(distX, 2) + Math.pow(distY, 2));
            if (dist <= map.tileWidth * 1.5) {
                this.battle(npc.pokemon);
                return true;
            }
        }
    });
}
function interactPokemon(map) {
    map.pokemon.forEach(pokemon => {
        if (pokemon.isActive) {
            const distX = (this.x + this.width / 2) - (pokemon.x + pokemon.width / 2);
            const distY = (this.y + this.height / 2) - (pokemon.y + pokemon.height / 2);
            const dist = Math.sqrt(Math.pow(distX, 2) + Math.pow(distY, 2));
            if (dist <= map.tileWidth * 1.5) {
                pokemon.isActive = false;
                this.capture(pokemon.pokemon);
                return true;
            }
        }
    })
}

// ========================================== //
// ================ battle ================== //
// ========================================== //

const battleButtons = document.getElementsByClassName("battle_button");
let battleActions = -1;
for (let i = 0; i < battleButtons.length; i++) {
    battleButtons[i].addEventListener("click", (e) => {
            if (!isBattleTextOn) {
                battleActions = i;
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
    if (!this.hasCompanion) {
        customAlert("je hebt nog geen pokemon om mee te vechten")
        return;
    }
    this.isInBattle = true
    let isBattling = true;
    let battleText;
    const stage = backpack.openBattleEvent();

    let isMyTurn = true;
    const playerObject = stage[0];
    const playerMaxHp = this.companion.pokemon.stats[0]["base_stat"];
    let playerHp = playerMaxHp;
    let playerHpPercent;
    let playerAudio = new Audio(this.companion.pokemon.cries["latest"]);

    const enemyObject = stage[1];
    let enemyMaxHp = pokemon.stats[0]["base_stat"];
    let enemyHp = enemyMaxHp;
    let enemyHpPercent;
    let enemyAudio = new Audio(pokemon.cries["latest"]);

    playerObject.name.innerHTML = this.companion.pokemon.name;
    playerObject.hp.innerHTML = `${playerHp}HP`;
    playerObject.img.src = this.companion.pokemon.sprites["back_default"];
    playerObject.hpBar.style.background = `linear-gradient(to right, #00ff00 100%, #000000 100%)`;
    enemyObject.name.innerHTML = pokemon.name;
    enemyObject.hp.innerHTML = `${enemyHp}HP`;
    enemyObject.hpBar.style.background = `linear-gradient(to right, #00ff00 100%, #000000 100%)`;
    enemyObject.img.src = pokemon.sprites["front_default"];


    const intervalId = setInterval(() => {
        if (!isBattleTextOn) {
            if (!isBattling) {
                clearInterval(intervalId);
                backpack.closeBattleEvent();
                this.isInBattle = false;
                if (enemyHp === 0 && !pokemon.isCaptured) {
                    this.capture(pokemon);
                }
                return;
            }
            if (enemyHp === 0) {
                setBattleMsg("Je hebt gewonnen")
                this.companion.pokemon.stats[6].base_stat++;
                isBattling = false;
                return
            }
            if (playerHp === 0) {
                setBattleMsg("Je hebt verloren")
                this.companion.pokemon.stats[7].base_stat++;
                isBattling = false;
                return;
            }
            if (isMyTurn) {
                battleText = this.companion.pokemon.name + " ";
                if (battleActions === 0) {
                    const dmg = Math.max(0, this.companion.pokemon.stats[1]["base_stat"] - pokemon.stats[2]["base_stat"]);
                    enemyHp = Math.max(0, enemyHp - dmg);
                    enemyAudio.play();

                    battleText += `valt aan met een normal attack en doet ${dmg} schade`;
                    isMyTurn = false;
                }
                if (battleActions === 1) {
                    const dmg = Math.max(0, this.companion.pokemon.stats[3]["base_stat"] - pokemon.stats[4]["base_stat"]);
                    enemyHp = Math.max(0, enemyHp - dmg);
                    enemyAudio.play();

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
                    const dmg = Math.max(0, pokemon.stats[1]["base_stat"] - this.companion.pokemon.stats[2]["base_stat"]);
                    playerHp = Math.max(0, playerHp - dmg);

                    battleText += `valt aan met een normal attack en doet ${dmg} schade`;
                }
                if (rand === 1) {
                    const dmg = Math.max(0, pokemon.stats[3]["base_stat"] - this.companion.pokemon.stats[4]["base_stat"]);
                    playerHp = Math.max(0, playerHp - dmg);

                    battleText += `valt aan met een special attack en doet ${dmg} schade`;
                }
                playerAudio.play();
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
    const stage = backpack.openCaptureEvent();
    stage.name.innerHTML = pokemon.name;
    stage.img.src = pokemon.sprites["front_default"];
    stage.nickNameDiv.style.display = "none";
    let hasPokemon = this.capturedPokemon.includes(pokemon);
    let chances = 3;
    for (let i = 0; i < stage.chances.children.length; i++) {
        stage.chances.children[i].style.filter = "grayscale(0%)";
    }
    const captureChance = (50 - pokemon.stats[2]["base_stat"] + (this.hasCompanion ? this.companion.pokemon.stats[1]["base_stat"] : 0)) / 100;
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
                this.releasePokemon(pokemon);
                clearInterval(intervalId);
                backpack.closeCaptureEvent();
            }
            else {
                chances--;
                stage.chances.children[chances].style.filter = "grayscale(100%)";
                const rand = Math.random();
                if (rand <= captureChance) {
                    this.capturedPokemon.push(pokemon);
                    pokemon.isKnown = true;
                    pokemon.isCaptured = true;
                    hasPokemon = true;
                    chances = 0;
                }
                if (chances === 0) {
                    if (hasPokemon) {
                        customAlert(`je hebt ${pokemon.name} gevangen`);
                        const input = stage.nickNameDiv.getElementsByTagName("input")[0];
                        input.value = "";
                        stage.nickNameDiv.style.display = "block";
                        stage.nickNameDiv.getElementsByTagName("button")[0].addEventListener("click", () => {
                            pokemon.nickname = input.value;
                            backpack.closeCaptureEvent();
                        });
                    }
                    else {
                        customAlert(`${pokemon.name} is ontsnapt`);
                        backpack.closeCaptureEvent();
                    }
                    clearInterval(intervalId);

                }
            }
        }
    }, 45)
}
