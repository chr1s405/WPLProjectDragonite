import { Map } from "./map.js";
import { Companion } from "./companion.js";
import { Npcs } from "./npc's.js";
import { openBattleEvent, closeBattleEvent, openCaptureEvent, closeCaptureEvent } from "../backpack.js";

let pokemonList;
const battleButtons = document.getElementsByClassName("battle_button");
const battleActions = [];
for (let i = 0; i < battleButtons.length; i++) {
    battleActions.push({
        button: battleButtons[i],
        value: false,
    })
    battleActions[i].button.addEventListener("click", (e) => {
        if (Player.isInBattle) {
            battleActions[i].value = true;
        }
    })
}
const captureButton = document.getElementById("capture_button");
const captureActions = {
  button: captureButton,
  value: false,
}
captureButton.addEventListener("click", ()=>{
  if(Player.isCapturing){
    captureActions.value = true;
  }
})
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
    hasCompanion: false,
    pokemon: undefined,
    capturedPokemon: [],
    isInBattle: false,
    isCapturing: false,
    isInEvent: false,
    isDebugOn: false,

    update() {
        this.div.style.left = `${this.x}px`;
        this.div.style.top = `${this.y}px`;
        if(this.hasCompanion){
            Companion.update();
        }
        if (this.isDebugOn) {
            this.debug();
        }
    },
    getPokemon(allPokemon) {
        pokemonList = allPokemon;
        this.assignPokemon(pokemonList[Math.trunc(Math.random() * pokemonList.length)]);
    },
    assignPokemon(pokemon) {
        this.pokemon = pokemon;
        this.hasCompanion = true;
        Companion.getCompanion()
        if(!this.capturedPokemon.includes(pokemon)){
            this.capturedPokemon.push(pokemon);
        }
    },
    removeCompanion(){
        this.pokemon = undefined;
        this.hasCompanion = false;
        Companion.removeCompanion();
    },
    moveUp() {
        this.direction = Direction.up;
        const tempY = this.y - this.speed;
        if (!(tempY < 0)) {
            this.move(this.x, tempY);
        }
    },
    moveDown() {
        this.direction = Direction.down;
        const tempY = this.y + this.speed;
        if (!(tempY + this.height > Map.height)) {
            this.move(this.x, tempY);
        }
    },
    moveLeft() {
        this.direction = Direction.left;
        const tempX = this.x - this.speed;
        if (!(tempX < 0)) {
            this.move(tempX, this.y);
        }
    },
    moveRight() {
        this.direction = Direction.right;
        const tempX = this.x + this.speed;
        if (!(tempX + this.width > Map.width)) {
            this.move(tempX, this.y);
        }
    },
    move(x, y) {
        const tileId = Map.layerData[(Map.positionInGrid(x, y))];
        if (!Map.collisionTiles.includes(tileId)) {
            this.x = x;
            this.y = y;
        }
        if (tileId === 32) {
            const rand = Math.trunc(Math.random() * 10);
            if(rand === 0){
              const pokemon = pokemonList[Math.trunc(Math.random() * pokemonList.length)];
              battle(pokemon)
            }
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
    Npcs.npcsActive.forEach((npc) => {
        const distX = (Player.x + Player.width / 2) - (npc.x + npc.width / 2);
        const distY = (Player.y + Player.height / 2) - (npc.y + npc.height / 2);
        const dist = Math.sqrt(Math.pow(distX, 2) + Math.pow(distY, 2));
        if (dist <= Map.tileWidth * 1) {
            battle(npc.pokemon);
        }
    });
}
function interacPokemon() {

}
function battle(pokemon) {
    Player.isInBattle = true;
    const stage = openBattleEvent();
    Player.isInEvent = true;
    let isBattling = true;

    const playerMaxHp = Player.pokemon.stats[0]["base_stat"]
    let playerHp = playerMaxHp;
    let playerAtk = Player.pokemon.stats[1]["base_stat"];
    let playerDef = Player.pokemon.stats[2]["base_stat"];
    let playerSpAtk = Player.pokemon.stats[3]["base_stat"];
    let playerSpDef = Player.pokemon.stats[4]["base_stat"];
    let isMyTurn = true;
    let enemyMaxHp = pokemon.stats[0]["base_stat"];
    let enemyHp = enemyMaxHp;
    let enemyAtk = pokemon.stats[1]["base_stat"];
    let enemyDef = pokemon.stats[2]["base_stat"];
    let enemySpAtk = pokemon.stats[3]["base_stat"];
    let enemySpDef = pokemon.stats[4]["base_stat"];
    const playerObject = stage[0];
    const enemyObject = stage[1];
    playerObject.name.innerHTML = Player.pokemon.name;
    enemyObject.name.innerHTML = pokemon.name;
    const intervalId = setInterval(() => {
        if (isMyTurn) {
            if (battleActions[0].value) {
                const dmg = Math.max(0, playerAtk - enemyDef);
                enemyHp = Math.max(0, enemyHp - dmg);
                console.log("player does normal attack");
                console.log(`dmg: ${dmg}`);
                battleActions[0].value = false;
                isMyTurn = false;
            }
            if (battleActions[1].value) {
                const dmg = Math.max(0, playerSpAtk - enemySpDef);
                enemyHp = Math.max(0, enemyHp - dmg);
                console.log("player does special attack");
                console.log(`dmg: ${dmg}`);
                battleActions[1].value = false;
                isMyTurn = false;
            }
            if (battleActions[2].value) {

                battleActions[2].value = false;
                console.log("you ran away");
                isBattling = false;
            }
            if (enemyHp === 0) {
                console.log("you won");
                isBattling = false;
            }

        }
        else {
            const rand = Math.round(Math.random())
            if (rand === 0) {
                const dmg = Math.max(0, enemyAtk - playerDef);
                playerHp = Math.max(0, playerHp - dmg);
                console.log("enemy does normal attack");
                console.log(`dmg: ${dmg}`);
            }
            if (rand === 1) {
                const dmg = Math.max(0, enemySpAtk - playerSpDef);
                playerHp = Math.max(0, playerHp - dmg);
                console.log("enemy does special attack");
                console.log(`dmg: ${dmg}`);
            }
            isMyTurn = true;
            if (playerHp === 0) {
                console.log("you lost");
                isBattling = false;
            }
        }
        playerObject.img.src = Player.pokemon.sprites["back_default"];
        playerObject.hp.innerHTML = `${playerHp}HP`;
        enemyObject.img.src = pokemon.sprites["front_default"];
        enemyObject.hp.innerHTML = `${enemyHp}HP`;
        const playerHpPercent = playerHp / playerMaxHp * 100;
        const enemyHpPercent = enemyHp / enemyMaxHp * 100;
        playerObject.hpBar.style.background = `linear-gradient(to right, #00ff00 ${playerHpPercent}%, #000000 ${playerHpPercent}%)`
        enemyObject.hpBar.style.background = `linear-gradient(to right, #00ff00 ${enemyHpPercent}%, #000000 ${enemyHpPercent}%)`
        if (!isBattling) {
            clearInterval(intervalId);
            Player.isInBattle = false;
            closeBattleEvent();
            Player.isInEvent = false;
        }
    }, 45)
}
function capture(pokemon) {
  const stage = openCaptureEvent();
  stage.nane.innerHTML = pokemon.name;
  stage.img.src = pokemon.sprites["front_default"];
  const hasPokemon = Player.capturedPokemon.includes(pokemon);
  let chances = 3;
  if(hasPokemon){
    stage.button.style.border = "3px solid green";
  }
  else{
    stage.button.style.border = "3px solid red";
  }
  const intervalId = setInterval(() => {
    if(captureActions.value){
      captureActions.value = false;
      if(hasPokemon){
        
      }
      else{
        chances--;
        if(chances === 0){
          clearInterval(intervalId);
        }
      }
    }
  },45)
}