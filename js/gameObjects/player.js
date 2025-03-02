import { Map } from "./map.js";
import { Npcs } from "./npc's.js";
import { openBattleEvent, closeBattleEvent } from "../backpack.js";

const actions = [];
const battleButtons = document.getElementsByClassName("battle_button");
//id 0 = attack, id 1 = defence, id 2 = heal
for (let i = 0; i < battleButtons.length; i++) {
    actions.push({
        button: battleButtons[i],
        value: false,
    })
    actions[i].button.addEventListener("click", (e) => {
        if (Player.isInBattle) {
            actions[i].value = true;
        }
    })
}
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
    pokemon: undefined,
    isInBattle: false,
    isDebugOn: false,

    update() {
        this.div.style.left = `${this.x}px`;
        this.div.style.top = `${this.y}px`;
        if (this.isDebugOn) {
            this.debug();
        }
    },
    assignPokemon(pokemonList) {
        if (this.pokemon === undefined) {
            this.pokemon = pokemonList[Math.trunc(Math.random() * pokemonList.length)];
        };
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
    interact() {
        interactNpc();
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


function interactNpc() {
    Npcs.npcList.forEach((npc) => {
        if (npc.isRendered) {
            const distX = (Player.x + Player.width / 2) - (npc.x + npc.width / 2);
            const distY = (Player.y + Player.height / 2) - (npc.y + npc.height / 2);
            const dist = Math.sqrt(Math.pow(distX, 2) + Math.pow(distY, 2));
            if (dist <= Map.tileWidth * 1) {
                battle(npc);
            }
        }
    });
}
function battle(enemy) {
    Player.isInBattle = true;
    const stage = openBattleEvent();
    let isBattling = true;

    const playerMaxHp = Player.pokemon.stats[0]["base_stat"]
    let playerHp = playerMaxHp;
    let playerAtk = Player.pokemon.stats[1]["base_stat"];
    let playerDef = Player.pokemon.stats[2]["base_stat"];
    let isMyTurn = true;
    let enemyMaxHp = enemy.pokemon.stats[0]["base_stat"];
    let enemyHp = enemyMaxHp;
    let enemyAtk = enemy.pokemon.stats[1]["base_stat"];
    let enemyDef = enemy.pokemon.stats[2]["base_stat"];

    const playerObject = stage[0];
    const enemyObject = stage[1];
    playerObject.name.innerHTML = Player.pokemon.name;
    enemyObject.name.innerHTML = enemy.pokemon.name;
    const intervalId = setInterval(() => {
        if (isMyTurn) {
            if (actions[0].value) {
                const dmg = Math.max(0, playerAtk - enemyDef);
                enemyHp = Math.max(0, enemyHp - dmg);
                console.log("player attacks");
                console.log(`dmg: ${dmg}`);
                actions[0].value = false;
                isMyTurn = false;
            }
            if (actions[1].value) {

                actions[1].value = false;
                isMyTurn = false;
            }
            if (actions[2].value) {
                
                actions[2].value = false;
                isMyTurn = false;
            }
            if (enemyHp === 0) {
                console.log("you won");
                isBattling = false;
            }

        }
        else {
            const dmg = Math.max(0, enemyAtk - playerDef);
            playerHp = Math.max(0, playerHp - dmg);
            console.log("enemy attacks");
            console.log(`dmg: ${dmg}`);
            isMyTurn = true;
            if (playerHp === 0) {
                console.log("you lost");
                isBattling = false;
            }
        }
        playerObject.img.src = Player.pokemon.sprites["back_default"];
        playerObject.hp.innerHTML = `${playerHp}HP`;
        enemyObject.img.src = enemy.pokemon.sprites["front_default"];
        enemyObject.hp.innerHTML = `${enemyHp}HP`;
        const playerHpPercent = playerHp / playerMaxHp * 100;
        const enemyHpPercent = enemyHp / enemyMaxHp * 100;
        playerObject.hpBar.style.background = `linear-gradient(to right, #00ff00 ${playerHpPercent}%, #000000 ${playerHpPercent}%)`
        enemyObject.hpBar.style.background = `linear-gradient(to right, #00ff00 ${enemyHpPercent}%, #000000 ${enemyHpPercent}%)`
        if (!isBattling) {
            clearInterval(intervalId);
            Player.isInBattle = false;
            closeBattleEvent();
        }
    }, 45)
}