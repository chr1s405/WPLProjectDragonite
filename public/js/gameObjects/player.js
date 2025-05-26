import { allPokemon, backpack, createSimplePokemon, findPokemon, setAlert, setConfirmBox, setInput } from "../game.js";

export function createPlayer(playerData) {
    const character = document.getElementById("character");
    character.style.left = `${playerData.x}px`;
    character.style.top = `${playerData.y}px`;
    character.style.backgroundImage = `url(${playerData.sprite})`
    const player = {
        div: character,
        x: playerData.x,
        y: playerData.y,
        width: character.clientWidth,
        height: character.clientHeight,
        speed: 15,
        velocityX: 0,
        velocityY: 0,
        isMovingUp: false,
        isMovingDown: false,
        isMovingLeft: false,
        isMovingRight: false,
        direction: playerData.direction,
        portrait: playerData.portrait,
        spriteIndex: 0,
        companion: playerData.companion,
        capturedPokemon: playerData.capturedPokemon,
        knownPokemon: playerData.knownPokemon,
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
        discoverPokemon,
        capturePokemon,
        releasePokemon,
        interact,
        interactNpc,
        interactPokemon,
        battle,
        capture,

        toggleDebug,
        debug,
    }
    if (Object.keys(player.companion).length === 0) {
        player.capturePokemon(allPokemon.find((pokemon) => { return pokemon.name === playerData.starterPokemon }).id);
        player.setCompanion(player.capturedPokemon[0].id);
        setTimeout(() => { document.getElementById("alert").click() }, 1);
    }
    else {
        player.setCompanion(player.companion.id);
        setTimeout(() => { document.getElementById("alert").click() }, 1);
    }
    return player;
}

function update(map) {
    this.move(map);
    this.div.style.left = `${this.x}px`;
    this.div.style.top = `${this.y}px`;
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
    map.centerMap(this);
    if (this.velocityX !== 0 || this.velocityY !== 0) {
        if (Math.round(Math.random() * 70) === 0) {
            if (map.layerData[map.positionInGrid(this.x, this.y)] == 32) {
                const pokemonId = Math.trunc(Math.random() * allPokemon.length - 1);
                this.battle(this.companion, createSimplePokemon(pokemonId), true);
            }
        }
    }
    this.velocityX = 0;
    this.velocityY = 0;
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
async function setCompanion(pokemonId) {
    const pokemon = this.capturedPokemon.find((search) => { return search.id === pokemonId });
    if (pokemon) {
        this.companion = pokemon;
        document.getElementById("companionIcon").src = findPokemon(pokemonId).sprites["front_default"]
        await setAlert(`Je companion is nu ${pokemon.name}`);
    }
    else {
        await setAlert("Je hebt deze pokemon nog niet gevangen.");
    }
}
function discoverPokemon(pokemonId) {
    if (!this.knownPokemon.includes(pokemonId)) {
        this.knownPokemon.push(pokemonId);
    }
}
async function capturePokemon(pokemonId, nickname = "") {
    this.discoverPokemon(pokemonId);
    const pokemon = createSimplePokemon(pokemonId, nickname);
    this.capturedPokemon.push(pokemon);
    await setAlert(`Je hebt ${pokemon.name} gevangen.`);
}
async function releasePokemon(pokemonId) {
    if (this.companion.id === pokemonId) {
        await setAlert("Kies eerst een andere companion.");
    }
    else {
        let pokemonIdx = -1;
        for (let i = 0; i < this.capturedPokemon.length; i++) {
            if (this.capturedPokemon[i].id === pokemonId) {
                pokemonIdx = i;
                break;
            }
        }
        if (pokemonIdx < 0) {
            await setAlert("Je hebt deze pokemon niet gevangen.");
        }
        else {
            await setAlert(`Je hebt ${this.capturedPokemon[pokemonIdx].name} losgelaten.`);
            this.capturedPokemon.splice(pokemonIdx, 1);
        }
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
}
function debug(map) {
    this.div.getElementsByClassName("debug")[0].innerHTML =
        `(${this.x}, ${this.y})</br>${map.positionInGrid(this.x, this.y)}`;
}

//interact
async function interact(map) {
    if (await this.interactNpc(map)) {
        return;
    }
    else if (await this.interactPokemon(map)) {
        return;
    }
}
async function interactNpc(map) {
    for (let i = 0; i < map.npcs.length; i++) {
        const npc = map.npcs[i];
        if (npc.isOnScreen) {
            const distX = (this.x + this.width / 2) - (npc.x + npc.width / 2);
            const distY = (this.y + this.height / 2) - (npc.y + npc.height / 2);
            const dist = Math.sqrt(Math.pow(distX, 2) + Math.pow(distY, 2));
            if (dist <= map.tileWidth * 1.5) {
                await npc.interact();
                this.battle(this.companion, npc.companion);
                return true;
            }
        }
    }
}
function interactPokemon(map) {
    for (let i = 0; i < map.pokemon.length; i++) {
        const pokemon = map.pokemon[i];
        if (pokemon.isOnScreen) {
            const distX = (this.x + this.width / 2) - (pokemon.x + pokemon.width / 2);
            const distY = (this.y + this.height / 2) - (pokemon.y + pokemon.height / 2);
            const dist = Math.sqrt(Math.pow(distX, 2) + Math.pow(distY, 2));
            if (dist <= map.tileWidth * 1.5) {
                pokemon.isActive = false;
                this.capture(pokemon.pokemon);
                pokemon.deletePokemon();
                return true;
            }
        }
    }
}

// ========================================== //
// ================ battle ================== //
// ========================================== //

async function battle(playerPokemon, enemy, capture = false) {
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
    stages[0].img.src = findPokemon(playerPokemon.id).sprites.other.showdown["back_default"];
    stages[0].name.innerHTML = findPokemon(playerPokemon.id).name;
    stages[0].hp.innerHTML = playerPokemon.stats.maxHp + " HP";
    stages[0].hpBar.style.background = `linear-gradient(to right, #00ff00 100%, #000000 100%)`
    stages[1].img.src = findPokemon(enemy.id).sprites.other.showdown["front_default"];
    stages[1].name.innerHTML = findPokemon(enemy.id).name;
    stages[1].hp.innerHTML = enemy.stats.maxHp + " HP";
    stages[1].hpBar.style.background = `linear-gradient(to right, #00ff00 100%, #000000 100%)`

    return await battleRound(this);

    async function battleRound(player) {
        let action = await pressButton();
        if (await battleAction(action, playerPokemon, enemy, stages[1])) {
            if (enemy.stats.hp === 0) {
                playerPokemon.stats.wins++;
                battleText = "Je hebt gewonnen.";
            }
            else {
                playerPokemon.stats.losses++;
                battleText = "Je bent weggelopen."
                capture = false;
            }
            await setBattleText(battleText);
            if (capture) {
                if (await setConfirmBox(`Wil je ${enemy.name} vangen`)) {
                    player.capturePokemon(enemy.id, await setInput(`Kies een bijnaam.`));
                }
            }
            await battleCleanup();
            return enemy.stats.hp === 0 ? enemy.id : -1;
        }
        action = Math.round(Math.random());
        if (await battleAction(action, enemy, playerPokemon, stages[0])) {
            playerPokemon.stats.losses++;
            battleText = "Je hebt verloren.";
            await battleCleanup(false);
            return -1;
        }
        await setBattleText(battleText);
        return await battleRound(player);
    }
    async function battleCleanup() {
        playerPokemon.stats.hp = playerPokemon.stats.maxHp;
        enemy.stats.hp = enemy.stats.maxHp;
        backpack.closeBattleEvent();
    }
    async function battleAction(action, attacker, defender, defStage) {
        battleText = attacker.name;
        if (action === 0) {
            const dmg = Math.max(0, attacker.stats.atk - defender.stats.def);
            defender.stats.hp = Math.max(0, defender.stats.hp - dmg);
            battleText += ` valt aan met een normal attack en doet ${dmg} schade.`;
            new Audio(findPokemon(defender.id).cries["latest"]).play();
        }
        if (action === 1) {
            const dmg = Math.max(0, attacker.stats.spAtk - defender.stats.spDef);
            defender.stats.hp = Math.max(0, defender.stats.hp - dmg);
            battleText += ` valt aan met een special attack en doet ${dmg} schade.`;
            new Audio(findPokemon(defender.id).cries["latest"]).play(0)
        }
        if (action === 2) {
            return true;
        }
        const hpPercent = defender.stats.hp / defender.stats.maxHp * 100;
        defStage.hp.innerHTML = `${defender.stats.hp} HP`;
        defStage.hpBar.style.background = `linear-gradient(to right, #00ff00 ${hpPercent}%, #000000 ${hpPercent}%)`;
        await setBattleText(battleText);
        return defender.stats.hp === 0;
    }
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
        chances: document.getElementById("capture_chances"),
    }

    stage.name.innerHTML = pokemon.name;
    stage.img.src = findPokemon(pokemon.id).sprites.other.showdown["front_default"];
    stage.button.style.border = this.capturedPokemon.find(search => { return search.id === pokemon.id }) ? "3px solid green" : "3px solid red";
    let chances = 3;
    const captureChance = (50 - findPokemon(pokemon.id).stats[2].base_stat + (this.companion ? this.companion.stats.atk : 0)) / 100;
    for (let i = 0; i < stage.chances.children.length; i++) {
        stage.chances.children[i].style.filter = "grayscale(0%)";
    }

    let captured = false;
    const captureBtn = document.getElementById("capture_button");
    if (this.capturedPokemon.find((search) => { return search.id === pokemon.id })) {
        captureBtn.addEventListener("click", async () => {
            this.releasePokemon(pokemon.id);
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
                await player.capturePokemon(pokemon.id, await setInput("Kies een bijnaam."));
                ;
                chances = 0;
            }
            if (chances > 0) {
                tryCapture(player);
            }
            else {
                if (!captured) {
                    await setAlert(`${pokemon.name} is ontsnapt.`);
                }
                backpack.closeCaptureEvent();
            }
        }, { once: true })
    }
}
