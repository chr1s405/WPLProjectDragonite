import { allPokemon, createSimplePokemon, setTextBox } from "../game.js";

const sprites = [
  "../../assets/characters/Red.png",
  "../../assets/characters/leaf.png",
  "../../assets/characters/lucas.webp",
  "../../assets/characters/dawn.png",
  "../../assets/characters/calem.png",
  "../../assets/characters/serena.png"
]

export function createNpc(map, npcData) {
  const npcDiv = document.createElement("div");
  npcDiv.setAttribute("class", "npc");
  npcDiv.style.left = `${npcData.x}px`;
  npcDiv.style.top = `${npcData.y}px`;
  npcDiv.style.backgroundImage = `url(${`${sprites[Math.trunc(Math.random() * sprites.length)]}`})`;

  const names = ["name1", "name2", "name3", "name4", "name5", "name6", "name7", "name8", "name9", "name0"]
  const npc = {
    type: "npc",
    name: names[Math.trunc(Math.random() * names.length)],
    div: npcDiv,
    x: npcData.x,
    y: npcData.y,
    width: 50, //gets calculated in map.addObject()
    height: 50,
    speed: 10,
    velocityX: 0,
    velocityY: 0,
    direction: "down",
    spriteIndex: 0,
    path: [],
    isMoving: false,
    isOnScreen: false,
    companion: npcData.companion,

    update,
    move,
    goTo,
    setDirection,
    interact,
  };
  if (Object.keys(npc.companion).length === 0) {
    npc.companion = createSimplePokemon(allPokemon[Math.trunc(Math.random() * allPokemon.length)].id);
  }
  return npc;
}
function update(map) {
  if (Math.trunc(Math.random() * 100) === 1) {
    const dest = map.getRandomPosition(this.x, this.y, 200);
    this.goTo(map, map.positionInGrid(dest.x, dest.y));
  }
  this.move(map);
  this.div.style.left = `${this.x}px`;
  this.div.style.top = `${this.y}px`;
  this.div.style.backgroundPositionX = `${Math.trunc(this.spriteIndex) * -52}px`;
  if (this.isOnScreen !== map.isOnScreen(this.x, this.y, this.width, this.height)) {
    this.isOnScreen = !this.isOnScreen;
  }
  if (this.isOnScreen) {
  }
}
function goTo(map, dest) {
  if (this.path.length === 0) {
    this.path = map.findPath(map.positionInGrid(this.x, this.y), dest);
  }
}
function move(map) {
  if (this.path.length > 0) {
    let pos = map.positionInWorld(this.path[0]);
    if (this.y > pos.y) {
      this.y -= Math.min(this.speed, Math.abs(pos.y - this.y));
      this.setDirection("up")
    };
    if (this.y < pos.y) {
      this.y += Math.min(this.speed, Math.abs(pos.y - this.y));
      this.setDirection("down")
    };
    if (this.x > pos.x) {
      this.x -= Math.min(this.speed, Math.abs(pos.x - this.x));
      this.setDirection("left")
    };
    if (this.x < pos.x) {
      this.x += Math.min(this.speed, Math.abs(pos.x - this.x));
      this.setDirection("right")
    };

    if (pos.x === this.x && pos.y === this.y) {
      this.path.splice(0, 1)
    };
  }
  else {
    this.spriteIndex = 0;
  }
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
}
async function interact() {
  const battleMsg = [
    "laten we vechten", "ik zal je verslaan", "ben je klaar om te verliezen", "als ik klaar met je ben, blijft er niets meer van je over", "ik maak gehakt van je"
  ];
  await setTextBox(battleMsg[Math.trunc(Math.random() * battleMsg.length)], this.name);
}