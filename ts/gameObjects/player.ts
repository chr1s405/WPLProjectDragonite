import { createCompanion } from "./companion.js";
import { backpack, setAlert, setTextBox } from "../game.js";
import { Map, Player, Pokemon, WildPokemon } from "../../interfaces.js";

export function createPlayer() {
    const character: any = document.getElementById("character");
    const player: Player = {
        div: character,
        x: character.offsetLeft,
        y: character.offsetTop,
        width: character.clientWidth,
        height: character.clientHeight,
        speed: 20,//character.clientWidth,
        velocityX: 0,
        velocityY: 0,
        isMovingUp: false,
        isMovingDown: false,
        isMovingLeft: false,
        isMovingRight: false,
        direction: "down",
        spriteIndex: 0,
        companion: undefined,
        capturedPokemon: [],
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

function update(this: Player, map: Map) {
    this.move(map);
    this.div.style.left = `${this.x}px`;
    this.div.style.top = `${this.y}px`;
    if (this.companion) {
        this.companion.update(map);
    }
    if (this.isDebugOn) {
        this.debug(map);
    }
}

// movement
function moveUp(this: Player, isMoving: boolean) {
    this.isMovingUp = isMoving;
}
function moveDown(this: Player, isMoving: boolean) {
    this.isMovingDown = isMoving;
}
function moveLeft(this: Player, isMoving: boolean) {
    this.isMovingLeft = isMoving;
}
function moveRight(this: Player, isMoving: boolean) {
    this.isMovingRight = isMoving;
}
function move(this: Player, map: Map) {
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

function setDirection(this: Player, dir: string) {
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
async function setCompanion(this: Player, pokemon: Pokemon) {
    if (this.capturedPokemon.includes(pokemon)) {
        this.companion = 
        this.companion.setCompanion(pokemon);
        const nav: any = document.getElementById("nav-pokemon")
        if (nav != null) { nav.src = this.companion.pokemon.sprites["front_default"] };
    }
    else {
        await setAlert("je hebt deze pokemon nog niet gevangen");
    }
}
function removeCompanion(this: Player, ) {
    this.companion.removeCompanion();
    const nav: any = document.getElementById("nav-pokemon")
    if (nav != null) { nav.src = "../assets/pikachu_silouhette.png" };
}
async function capturePokemon(this: Player, pokemon: Pokemon) {
    pokemon.isKnown = true;
    pokemon.isCaptured = true;
    this.capturedPokemon.push(pokemon);
    await setAlert(`je hebt ${pokemon.name} gevangen`);
}
async function releasePokemon(this: Player, pokemon: Pokemon) {
    if (pokemon === this.companion.pokemon) {
        await setAlert("kies eerst een andere companion");
    }
    else if (!this.capturedPokemon.includes(pokemon)) {
        await setAlert("je hebt deze pokemon niet gevangen");
    }
    else {
        await setAlert(`je hebt ${pokemon.name} losgelaten`);
        const pokemonIdx = this.capturedPokemon.indexOf(pokemon);
        this.capturedPokemon.splice(pokemonIdx, 1);
        pokemon.isCaptured = false;
    }
}

//debug
function toggleDebug(this: Player, ) {
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
    this.companion.toggleDebug();
}
function debug(this: Player, map: Map) {
    this.div.getElementsByClassName("debug")[0].innerHTML =
        `(${this.x}, ${this.y})</br>${map.positionInGrid(this.x, this.y)}`;
}




//interact
function interact(this: Player, map: Map) {
    if (this.interactNpc(map)) {
        return;
    }
    if (this.interactPokemon(map)) {
        return;
    }
}
function interactNpc(this: Player, map: Map) {
    map.npcs.forEach(npc => {
        if (npc.isOnScreen) {
            const distX = (this.x + this.width / 2) - (npc.x + npc.width / 2);
            const distY = (this.y + this.height / 2) - (npc.y + npc.height / 2);
            const dist = Math.sqrt(Math.pow(distX, 2) + Math.pow(distY, 2));
            if (dist <= map.tileWidth * 1.5) {
                this.battle(this.companion.pokemon, npc.pokemon);
                return true;
            }
        }
    });
}
function interactPokemon(this: Player, map: Map) {
    map.pokemon.forEach((pokemon: WildPokemon) => {
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

async function battle(this: Player, player: Player, pokemon2: Pokemon) {
    if (!this.companion) {
        setAlert("je hebt nog geen pokemon om mee te vechten")
        return;
    }
    backpack.openBattleEvent();
    let battleText;
    const pokemon1 = player.companion.pokemon;
    const battleTextBox = document.getElementById("battle_text");
    const battleButtons = document.getElementsByClassName("battle_button");

    const stage = document.getElementsByClassName("battle_stage")
    const stages: any = [{
        img: stage[0].getElementsByTagName("img")[0], name: stage[0].getElementsByClassName("statusbar")[0].children[0],
        hpBar: stage[0].getElementsByClassName("statusbar")[0].children[1], hp: stage[0].getElementsByClassName("statusbar")[0].children[1].children[0],
    },
    {
        img: stage[1].getElementsByTagName("img")[0], name: stage[1].getElementsByClassName("statusbar")[0].children[0],
        hpBar: stage[1].getElementsByClassName("statusbar")[0].children[1], hp: stage[1].getElementsByClassName("statusbar")[0].children[1].children[0],
    }];
    stages[0].img.src = pokemon1.sprites["front_default"];
    stages[0].name.innerHTML = pokemon1.name;
    stages[0].hp.innerHTML = pokemon1.stats[0]["base_stat"];
    stages[0].hpBar.style.background = `linear-gradient(to right, #00ff00 100%, #000000 100%)`
    stages[1].img.src = pokemon2.sprites["front_default"];
    stages[1].name.innerHTML = pokemon2.name;
    stages[1].hp.innerHTML = pokemon2.stats[0]["base_stat"];
    stages[1].hpBar.style.background = `linear-gradient(to right, #00ff00 100%, #000000 100%)`

    const fighters = [{ nr: 1, type: "player", pokemon: pokemon1, hp: pokemon1.stats[0]["base_stat"], stage: stages[0], audio: new Audio(pokemon1.cries["latest"]) },
    { nr: 2, type: "npc", pokemon: pokemon2, hp: pokemon2.stats[0]["base_stat"], stage: stages[1], audio: new Audio(pokemon2.cries["latest"]) }];


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
    async function performAction(atk: any, def: any) {
        battleText = atk.pokemon.name;
        let action;
        if (atk.type === "player") {
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
            await setTextBox(battleTextBox, battleText);
            backpack.closeBattleEvent();
            return;
        }
        const hpPercent = def.hp / def.pokemon.stats[0]["base_stat"] * 100;
        def.stage.hp.innerHTML = `${def.hp}HP`;
        def.stage.hpBar.style.background = `linear-gradient(to right, #00ff00 ${hpPercent}%, #000000 ${hpPercent}%)`;
        await setTextBox(battleTextBox, battleText);
        if (def.hp > 0) {
            fighters.reverse();
            setTimeout(async () => { await performAction(fighters[0], fighters[1]) }, 0);
        }
        else {
            if(atk.type === "player"){
                if (!def.pokemon.isCaptured) {
                    atk.capturePokemon(def.pokemon);
                }
            }
            if (def.nr === 1) {
                def.pokemon.stats[7]["base_stat"]++
                battleText = "je hebt verloren";
            }
            else {
                atk.pokemon.stats[6]["base_stat"]++;
                battleText = "je hebt gewonnen";
            }
            await setTextBox(battleTextBox, battleText);
            backpack.closeBattleEvent();
        }
    }
}


// ========================================== //
// ================ capture ================= //
// ========================================== //

function capture(this: Player, pokemon: Pokemon) {

    backpack.openCaptureEvent();

    const element: any = document.getElementById("capture_main");
    const stage: any = {
        name: element.children[0], img: element.children[1], button: element.children[2],
        chances: document.getElementById("capture_chances"), nickNameDiv: document.getElementById("capture_nickname"),
    }

    stage.name.innerHTML = pokemon.name;
    stage.img.src = pokemon.sprites["front_default"];
    stage.nickNameDiv.style.display = "none";
    stage.button.style.border = this.capturedPokemon.includes(pokemon) ? "3px solid green" : "3px solid red";
    let chances = 3;
    const captureChance = (50 - pokemon.stats[2]["base_stat"] + (this.companion ? this.companion.pokemon.stats[1]["base_stat"] : 0)) / 100;
    for (let i = 0; i < stage.chances.children.length; i++) {
        stage.chances.children[i].style.filter = "grayscale(0%)";
    }

    let captured = false;
    const captureBtn: any = document.getElementById("capture_button");
    if (pokemon.isCaptured) {
        captureBtn.addEventListener("click", async () => {
            this.releasePokemon(pokemon);
            backpack.closeCaptureEvent();
        }, { once: true });
    }
    else {
        tryCapture(this);
    }

    function tryCapture(player: Player) {
        captureBtn.addEventListener("click", async () => {
            chances--;
            stage.chances.children[chances].style.filter = "grayscale(100%)";
            const rand = Math.random();
            if (rand <= captureChance) {
                captured = true;
            }
            if (captured) {
                await player.capturePokemon(pokemon);

                const input = stage.nickNameDiv.getElementsByTagName("input")[0];
                input.value = "";
                stage.nickNameDiv.style.display = "block";
                stage.nickNameDiv.getElementsByTagName("button")[0].addEventListener("click", () => {
                    pokemon.nickname = input.value;
                }, { once: true });

                chances = 0;
            }
            if (chances > 0) {
                tryCapture(player);
            }
            else {
                if (!captured) {
                    await setAlert(`${pokemon.name} is ontsnapt`);
                }
                backpack.closeCaptureEvent();
            }
        }, { once: true })
    }
}
