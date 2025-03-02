import { Map } from "./map.js";
import { Npcs } from "./npc's.js";
import { openBattleEvent } from "../backpack.js";

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
            if (dist <= Map.tileWidth * 1.5) {
                const stage = openBattleEvent();
                battle()
                const player = stage[0];
                const enemy = stage[1];
                console.log(player)
                player.name.innerHTML = Player.pokemon.name;
                player.img.src = Player.pokemon.sprites["back_default"];
                player.hp.innerHTML = `${Player.pokemon.stats[0]["base_stat"]}HP`;
                enemy.name.innerHTML = npc.pokemon.name;
                enemy.img.src = npc.pokemon.sprites["front_default"];
                enemy.hp.innerHTML = `${npc.pokemon.stats[0]["base_stat"]}HP`;

            }
        }
    });
}
function battle(enemy){
    const actions = document.getElementsByClassName("battle_button");
    //id 0 = attack, id 1 = defence, id 2 = heal
    let playerHp = Player.pokemon.stats[0];
    let playerAtk = Player.pokemon.stats[1];
    let playerDef = Player.pokemon.stats[2];
    let isMyTurn = true;
    let enemyHp = enemy.pokemon.stats[0];
    let enmyAtk = enemy.pokemon.stats[1];
    let enemyDef = enemy.pokemon.stats[2];


    do{
        if(isMyTurn){

        }
    }while(playerHp !== 0 && enemyHp !== 0);
}