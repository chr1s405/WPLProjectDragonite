import { createCompanion } from "./companion.js";
import { allPokemon, backpack, setAlert } from "../game.js";

export function createPlayer(x, y, direction, sprite, capturedPokemon, companion) {
    const character = document.getElementById("character");
    character.style.left = `${x}px`;
    character.style.top = `${y}px`;
    character.style.backgroundImage = `url(${sprite})`
    const player = {
        div: character,
        x: x,
        y: y,
        width: character.clientWidth,
        height: character.clientHeight,
        speed: 20,//character.clientWidth,
        velocityX: 0,
        velocityY: 0,
        isMovingUp: false,
        isMovingDown: false,
        isMovingLeft: false,
        isMovingRight: false,
        direction: direction,
        spriteIndex: 0,
        companion: companion,
        capturedPokemon: capturedPokemon,
        isInEvent: false,
        isDebugOn: false,

        update,
        moveUp,
        moveRight,
        moveDown,
        moveLeft,
        move,
        setDirection,
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
    if (this.companion.pokemon) {
        this.companion.update(map);
    }
    if (this.isDebugOn) {
        this.debug(map);
    }
}

// movement
function moveUp(isMoving) {
    this.isMovingUp = isMoving;
}
function moveDown(isMoving) {
    this.isMovingDown = isMoving;
}
function moveLeft(isMoving) {
    this.isMovingLeft = isMoving;
}
function moveRight(isMoving) {
    this.isMovingRight = isMoving;
}
function move(map) {
    if (this.isMovingUp) { this.velocityY -= this.speed };
    if (this.isMovingDown) { this.velocityY += this.speed };
    if (this.isMovingLeft) { this.velocityX -= this.speed };
    if (this.isMovingRight) { this.velocityX += this.speed };

    if (this.velocityX < 0) { this.setDirection("left") }
    else if (this.velocityX > 0) { this.setDirection("right") }
    else if (this.velocityY < 0) { this.setDirection("up") }
    else if (this.velocityY > 0) { this.setDirection("down") }
    else {
        this.setDirection("none");
    }
    map.handleCollision(this)
    this.x += this.velocityX;
    this.y += this.velocityY;
    this.velocityX = 0;
    this.velocityY = 0;
    map.centerMap(this);
}

function setDirection(dir) {
    switch (dir) {
        case "up": this.div.style.backgroundPositionY = `${3 * -52}px`; break;
        case "left": this.div.style.backgroundPositionY = `${1 * -52}px`; break;
        case "right": this.div.style.backgroundPositionY = `${2 * -52}px`; break;
        case "down": this.div.style.backgroundPositionY = `${0 * -52}px`; break;
        default: ; break;
    }
    if (dir !== "none") {
        if (dir = this.direction) {
            this.spriteIndex = (this.spriteIndex + .3) % 4;
        }
        else {
            this.spriteIndex = 0;
        }
    }
    else {
        this.spriteIndex = 0;
    }
    this.direction = dir;
    this.div.style.backgroundPositionX = `${Math.trunc(this.spriteIndex) * -52}px`;
}

//pokemon
async function setCompanion(pokemon) {
    const ownedPokemon = this.capturedPokemon.find((search) => { return search.id === pokemon.id });
    if (ownedPokemon) {
        this.companion.setCompanion(ownedPokemon);
        document.getElementById("nav-pokemon").src = this.companion.pokemon.sprites["front_default"]
    }
    else {
        await setAlert("je hebt deze pokemon nog niet gevangen");
    }
}
function removeCompanion() {
    this.companion.removeCompanion();
    document.getElementById("nav-pokemon").src = "../assets/pikachu_silouhette.png"
}
async function capturePokemon(pokemon, nickname) {
    allPokemon.find(search => { return search.id === pokemon.id }).isKnown = true;
    const pokemonCopy = Object.assign({}, pokemon);
    if (nickname !== "") { pokemonCopy.nickname = nickname; }
    this.capturedPokemon.push(pokemonCopy);
    await setAlert(`je hebt ${pokemon.name} gevangen`);
}
async function releasePokemon(pokemon) {
    let pokemonIdx = -1;
    const ownedPokemon = this.capturedPokemon.find((search, index) => {
        if (search.id === pokemon.id) {
            pokemonIdx = index;
            return search;
        }
    });
    if (!ownedPokemon) {
        await setAlert("je hebt deze pokemon niet gevangen");
    }
    else if (ownedPokemon === this.companion.pokemon) {
        await setAlert("kies eerst een andere companion");
    }
    else {
        await setAlert(`je hebt ${pokemon.name} losgelaten`);
        this.capturedPokemon.splice(pokemonIdx, 1);
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
    else if (this.interactPokemon(map)) {
        return;
    }
}
function interactNpc(map) {
    map.npcs.forEach(async (npc) => {
        if (npc.isOnScreen) {
            const distX = (this.x + this.width / 2) - (npc.x + npc.width / 2);
            const distY = (this.y + this.height / 2) - (npc.y + npc.height / 2);
            const dist = Math.sqrt(Math.pow(distX, 2) + Math.pow(distY, 2));
            if (dist <= map.tileWidth * 1.5) {
                await npc.interact();
                this.battle(this, npc);
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

async function battle(player, enemy) {
    if (!this.companion.pokemon) {
        setAlert("je hebt nog geen pokemon om mee te vechten")
        return;
    }
    backpack.openBattleEvent();
    let battleText;
    const battleTextBox = document.getElementById("battle_text");
    const battleButtons = document.getElementsByClassName("battle_button");

    const stage = document.getElementsByClassName("battle_stage")
    const stages = [{
        img: stage[0].getElementsByTagName("img")[0], name: stage[0].getElementsByClassName("statusbar")[0].children[0],
        hpBar: stage[0].getElementsByClassName("statusbar")[0].children[1], hp: stage[0].getElementsByClassName("statusbar")[0].children[1].children[0],
    },
    {
        img: stage[1].getElementsByTagName("img")[0], name: stage[1].getElementsByClassName("statusbar")[0].children[0],
        hpBar: stage[1].getElementsByClassName("statusbar")[0].children[1], hp: stage[1].getElementsByClassName("statusbar")[0].children[1].children[0],
    }];
    stages[0].img.src = player.companion.pokemon.sprites["front_default"];
    stages[0].name.innerHTML = player.companion.pokemon.name;
    stages[0].hp.innerHTML = player.companion.pokemon.stats[0]["base_stat"];
    stages[0].hpBar.style.background = `linear-gradient(to right, #00ff00 100%, #000000 100%)`
    stages[1].img.src = enemy.pokemon.sprites["front_default"];
    stages[1].name.innerHTML = enemy.pokemon.name;
    stages[1].hp.innerHTML = enemy.pokemon.stats[0]["base_stat"] + "HP";
    stages[1].hpBar.style.background = `linear-gradient(to right, #00ff00 100%, #000000 100%)`

    const fighters = [{ nr: 1, owner: player, pokemon: player.companion.pokemon, hp: player.companion.pokemon.stats[0]["base_stat"], stage: stages[0], audio: new Audio(player.companion.pokemon.cries["latest"]) },
    { nr: 2, owner: enemy, pokemon: enemy.pokemon, hp: enemy.pokemon.stats[0]["base_stat"], stage: stages[1], audio: new Audio(enemy.pokemon.cries["latest"]) }];


    performAction(fighters[0], fighters[1]);

    async function pressButton() {
        return new Promise((resolve, reject) => {
            for (let i = 0; i < battleButtons.length; i++) {
                battleButtons[i].addEventListener("click", () => {
                    for (let i = 0; i < battleButtons.length; i++) {
                        battleButtons[i].replaceWith(battleButtons[i].cloneNode(true));
                    }
                    resolve(i);
                })
            }
        })
    }
    async function performAction(atk, def) {
        battleText = atk.pokemon.name;
        let action;
        if (atk.nr === 1) {
            action = await pressButton();
        }
        else {
            action = Math.round(Math.random());
        }
        if (action === 0) {
            const dmg = Math.max(0, atk.pokemon.stats[1]["base_stat"] - def.pokemon.stats[2]["base_stat"]);
            def.hp = Math.max(0, def.hp - dmg);
            battleText += ` valt aan met een normal attack en doet ${dmg} schade`;
            if (def.audio) { def.audio.play(); }
        }
        if (action === 1) {
            const dmg = Math.max(0, atk.pokemon.stats[3]["base_stat"] - def.pokemon.stats[4]["base_stat"]);
            def.hp = Math.max(0, def.hp - dmg);
            battleText += ` valt aan met een special attack en doet ${dmg} schade`;
            if (def.audio) { def.audio.play(); }
        }
        if (action === 2) {
            battleText += ` loopt weg`;
            await setBattleText(battleText);
            backpack.closeBattleEvent();
            return;
        }
        const hpPercent = def.hp / def.pokemon.stats[0]["base_stat"] * 100;
        def.stage.hp.innerHTML = `${def.hp}HP`;
        def.stage.hpBar.style.background = `linear-gradient(to right, #00ff00 ${hpPercent}%, #000000 ${hpPercent}%)`;
        await setBattleText(battleText);
        if (def.hp > 0) {
            fighters.reverse();
            setTimeout(await performAction(fighters[0], fighters[1]), 0);
        }
        else {
            if (def.nr === 1) {
                def.pokemon.stats[7]["base_stat"]++
                battleText = "je hebt verloren";
            }
            else {
                atk.pokemon.stats[6]["base_stat"]++;
                if (!(def.owner.type === "npc")) {
                    atk.owner.capturePokemon(def.pokemon);
                }
                battleText = "je hebt gewonnen";
            }
            await setBattleText(battleText);
            backpack.closeBattleEvent();
        }
    }
    async function setBattleText(text) {
        let i = 0;
        const textBoxText = battleTextBox.getElementsByTagName("p")[0];
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                document.addEventListener("click", () => { i = text.length }, { once: true });
            }, 10);
            const intervalId = setInterval(() => {
                if (i < text.length) {
                    i++;
                    textBoxText.innerHTML = text.substring(0, i);
                }
                else {
                    textBoxText.innerHTML = text;
                    clearInterval(intervalId);
                    battleTextBox.getElementsByTagName("p")[1].style.display = "block";
                    document.addEventListener("click", () => {
                        textBoxText.innerHTML = "";
                        battleTextBox.getElementsByTagName("p")[1].style.display = "none";
                        resolve(true);
                    }, { once: true });
                }
            }, 30);
        })
    }
}


// ========================================== //
// ================ capture ================= //
// ========================================== //

function capture(pokemon) {

    backpack.openCaptureEvent();

    const element = document.getElementById("capture_main");
    const stage = {
        name: element.children[0], img: element.children[1], button: element.children[2],
        chances: document.getElementById("capture_chances"), nickNameDiv: document.getElementById("capture_nickname"),
    }

    stage.name.innerHTML = pokemon.name;
    stage.img.src = pokemon.sprites["front_default"];
    stage.nickNameDiv.style.display = "none";
    stage.button.style.border = this.capturedPokemon.find(search => { return search.id === pokemon.id }) ? "3px solid green" : "3px solid red";
    let chances = 3;
    const captureChance = (50 - pokemon.stats[2]["base_stat"] + (this.companion.pokemon ? this.companion.pokemon.stats[1]["base_stat"] : 0)) / 100;
    for (let i = 0; i < stage.chances.children.length; i++) {
        stage.chances.children[i].style.filter = "grayscale(0%)";
    }

    let captured = false;
    const captureBtn = document.getElementById("capture_button");
    if (this.capturedPokemon.find((search) => { return search.id === pokemon.id })) {
        captureBtn.addEventListener("click", async () => {
            this.releasePokemon(pokemon);
            backpack.closeCaptureEvent();
        }, { once: true });
    }
    else {
        tryCapture(this);
    }

    function tryCapture(player) {
        captureBtn.addEventListener("click", async () => {
            chances--;
            stage.chances.children[chances].style.filter = "grayscale(100%)";
            const rand = Math.random();
            if (rand <= captureChance) {
                captured = true;
            }
            if (captured) {
                await new Promise(async (resolve, reject) => {
                    let nickname = "";
                    const input = stage.nickNameDiv.getElementsByTagName("input")[0];
                    input.value = "";
                    stage.nickNameDiv.style.display = "block";
                    stage.nickNameDiv.querySelector("button").addEventListener("click", async () => {
                        nickname = input.value;
                        await player.capturePokemon(pokemon, nickname);
                        resolve();
                    }, { once: true });
                })

                chances = 0;
            }
            if (chances > 0) {
                tryCapture(player);
            }
            else {
                if (!captured) {
                    await setAlert(`${pokemon.name} is ontsnapt`);
                }
                // else {
                //     await new Promise((resolve, reject) => {
                //         const nickNameDiv = document.getElementById("capture_nickname");
                //         const input = nickNameDiv.getElementsByTagName("input")[0];
                //         input.value = "";
                //         nickNameDiv.style.display = "block";
                //         nickNameDiv.querySelector("button").addEventListener("click", () => {
                //             pokemon.nickname = input.value;
                //             nickNameDiv.style.display = "none";
                //             resolve();
                //         }, { once: true });
                //     })
                // }
                backpack.closeCaptureEvent();
            }
        }, { once: true })
    }
}
