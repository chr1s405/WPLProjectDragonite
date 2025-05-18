import { createMap } from "./gameObjects/map.js";
import { createPlayer } from "./gameObjects/player.js";
import { createBackpack } from "./gameObjects/backpack.js";

const userId = document.getElementById("userId").value;
let map;
let player;
let pause = false;
export let allPokemon;
export let backpack;


allPokemon = await GetPokemon();
await gameInit();
gameLoop();

async function gameInit() {
  let gameData = await loadGame();
  map = createMap(gameData.npcs);
  player = createPlayer(gameData.player);
  backpack = createBackpack(player);


  initMobileInput(player, map);
  addEventListener("keydown", (e) => {
    //   alert(e.keyCode);
    if (e.keyCode === 80) {
      pause = !pause;
    }
    if (!pause && !player.isInEvent) {
      if ([87, 38].includes(e.keyCode) /*w*/) {
        player.moveUp(true);
      }
      if ([65, 37].includes(e.keyCode) /*a*/) {
        player.moveLeft(true);
      }
      if ([83, 40].includes(e.keyCode) /*s*/) {
        player.moveDown(true);
      }
      if ([68, 39].includes(e.keyCode) /*d*/) {
        player.moveRight(true);
      }
      if (e.keyCode === 79 /*o*/) {
        toggleDebug();
      }
      if (e.keyCode === 73 /*i*/) {

      }
      if (e.keyCode === 13 /*enter*/) {
        player.interact(map);
      }
      if (e.keyCode === 32 /*space*/) {
      }
    }
  });
  addEventListener("keyup", (e) => {
    if (e.keyCode === 87 || e.keyCode === 38 /*w*/) {
      player.moveUp(false);
    }
    if (e.keyCode === 65 || e.keyCode === 37 /*a*/) {
      player.moveLeft(false);
    }
    if (e.keyCode === 83 || e.keyCode === 40 /*s*/) {
      player.moveDown(false);
    }
    if (e.keyCode === 68 || e.keyCode === 39 /*d*/) {
      player.moveRight(false);
    }
  })
  document.getElementById("saveBtn").addEventListener("click", () => {
    saveGame();
  })
  document.getElementById("resetBtn").addEventListener("click", () => {
    deleteGame();
  })
  document.getElementById("logoutBtn").addEventListener("click", () => {
    logout();
  })
}

function gameLoop() {
  const intervalId = setInterval(() => {
    if (!pause && !player.isInEvent) {
      map.update(player);
      player.update(map);
    };
    if (false) {
      clearInterval(intervalId);
    }
  }, 45);
}

function loadGame() {
  return fetch(`/pokemon/game/load?user=${userId}`, {
    method: "POST",
  })
    .then(async (res) => {
      return await res.json()
    })
}
function saveGame() {
  const playerData = { x: player.x, y: player.y, direction: player.direction, companion: player.companion, capturedPokemon: player.capturedPokemon, knownPokemon: player.knownPokemon };
  const npcsData = [];
  for (let i = 0; i < map.npcs.length; i++) {
    const npc = map.npcs[i]
    npcsData.push({ x: npc.x, y: npc.y, companion: npc.companion });
  }
  let saveData = { player: playerData, npcs: npcsData }
  fetch(`/pokemon/game/save?user=${userId}`, {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(saveData)
  })
    .then((res) => { return res.json() })
    .then(async (data) => { await setAlert("voortgang opgeslagen") })
}
function deleteGame() {
  fetch(`/pokemon/game/reset?user=${userId}`, {
    method: "POST"
  })
    .then((res) => { return res.json() })
    .then(async (data) => {
      console.log(" js delete in progress")
      await setAlert("voortgang verwijderd");
      window.location.href = data.path;
      console.log(" js delete done")
    })
}
async function logout() {
  await saveGame();
  fetch("/pokemon/game/logout", {
    method: "POST"
  })
    .then((res) => { return res.json() })
    .then((data) => { window.location.href = data.path });
}
function GetPokemon() {
  return fetch("/pokemon/game/getPokemon", {
    method: "POST"
  })
    .then((res) => { return res.json(); })
}
export function findPokemon(pokemonId) {
  return allPokemon.find((pokemon) => { return pokemon.id === pokemonId });
}
export function createSimplePokemon(pokemonId, nickname = "") {
  const pokemon = findPokemon(pokemonId);
  return {
    id: pokemon.id,
    name: pokemon.name,
    stats: {
      hp: pokemon.stats[0].base_stat,
      maxHp: pokemon.stats[0].base_stat,
      atk: pokemon.stats[1].base_stat,
      def: pokemon.stats[2].base_stat,
      spAtk: pokemon.stats[3].base_stat,
      spDef: pokemon.stats[4].base_stat,
      speed: pokemon.stats[5].base_stat,
      wins: 0,
      losses: 0,
    },
    nickname: nickname,
  };
}


export async function setTextBox(text, name = "") {
  const textbox = document.getElementById("textBox");
  const textboxName = document.getElementById("textBoxName");
  const textBoxText = document.getElementById("textBoxMsg");
  const continueText = textbox.getElementsByTagName("p")[textbox.getElementsByTagName("p").length - 1];
  textbox.style.display = "block";
  textboxName.innerHTML = name;
  pause = true;
  let i = 0;
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
        continueText.style.display = "block";
        document.addEventListener("click", () => {
          textBoxText.innerHTML = "";
          continueText.style.display = "none";
          textbox.style.display = "none";
          pause = false;
          resolve(true);
        }, { once: true });
      }
    }, 30);
  })
}
export async function setAlert(message) {
  const alert = document.getElementById("alert");
  return new Promise((resolve, reject) => {
    pause = true;
    alert.style.display = "block";
    alert.getElementsByTagName("p")[0].innerHTML = message;
    setTimeout(() => {
      alert.addEventListener("click", () => {
        pause = false;
        alert.style.display = "none";
        resolve(true);
      }, { once: true });
    }, 1);
  })
};

export async function setInput(message) {
  const inputBox = document.getElementById("inputBox");
  const input = inputBox.querySelector("input");
  const button = inputBox.querySelector("button");
  input.value = ""
  return new Promise((resolve, reject) => {
    pause = true;
    inputBox.style.display = "block";
    inputBox.querySelector("p").innerHTML = message;
    setTimeout(() => {
      button.addEventListener("click", () => {
        pause = false;
        inputBox.style.display = "none";
        resolve(input.value);
      }, { once: true });
    }, 1);
  })
};

function initMobileInput(player, map) {
  const joyStickCase = document.getElementById("joyStickCase");
  const joyStickBtn = joyStickCase.querySelector("button");
  const width = joyStickCase.offsetWidth;
  joyStickBtn.addEventListener("touchmove", (e) => {
    e.preventDefault()
    const touch = e.touches[0] || e.changedTouches[0];
    const mouseX = touch.clientX - joyStickCase.offsetLeft - width / 2;
    const mouseY = touch.clientY - joyStickCase.offsetTop - width / 2;
    const rad = Math.atan2(mouseY, mouseX);
    let x = Math.max(-width / 2, Math.min(mouseX, width / 2));
    let y = Math.max(-width / 2, Math.min(mouseY, width / 2));
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);
    const deadzone = width / 2 * 0.6
    player.moveLeft(x < -deadzone);
    player.moveRight(x > deadzone);
    player.moveUp(y < -deadzone);
    player.moveDown(y > deadzone);
    x = (x < 0 ? (Math.max(x, cos * width / 2)) : (Math.min(x, cos * width / 2))) + width / 2;
    y = (y < 0 ? (Math.max(y, sin * width / 2)) : (Math.min(y, sin * width / 2))) + width / 2;

    x = x / width * 100;
    y = y / width * 100;
    joyStickBtn.style.left = `${x}%`
    joyStickBtn.style.top = `${y}%`
  })
  joyStickBtn.addEventListener("touchend", (e) => {
    e.preventDefault();
    joyStickBtn.style.left = `50%`
    joyStickBtn.style.top = `50%`
    player.moveLeft(false);
    player.moveRight(false);
    player.moveUp(false);
    player.moveDown(false);
  })

  const mobileBtn = document.getElementById("mobileBtn");
  mobileBtn.addEventListener("touchstart", () => {
    player.interact(map);
  })
}

function toggleDebug() {
  player.toggleDebug();
}