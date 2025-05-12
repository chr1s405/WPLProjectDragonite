import { allPokemon, findPokemon, createSimplePokemon } from "../game.js"

export function createPokemon(map, x, y) {
    const pokemonDiv = document.createElement("div");
    pokemonDiv.setAttribute("class", "pokemon");

    const wildPokemon = {
        type: "pokemon",
        div: pokemonDiv,
        x: x,
        y: y,
        width: 50,
        height: 50,
        speed: 10,
        velocityX: 0,
        velocityY: 0,
        path: [],
        pokemon: undefined,
        timer: 0,
        timeToLive: 1000,
        isDead: false,

        deletePokemon,
        update,
        goTo,
        move,
    }
    wildPokemon.pokemon = createSimplePokemon(allPokemon[Math.trunc(Math.random() * allPokemon.length)].id);
    wildPokemon.div.style.backgroundImage = `Url(${findPokemon(wildPokemon.pokemon.id).sprites["front_default"]})`;
    const posOnScreen = map.getPositionOnScreen();
    wildPokemon.goTo(map, map.positionInGrid(posOnScreen.x, posOnScreen.y));
    return wildPokemon
}
function deletePokemon() {
    this.div.remove();
    this.isDead = true;
}
function update(map) {
    this.move(map);
    this.div.style.left = `${this.x}px`;
    this.div.style.top = `${this.y}px`;
    if (this.isOnScreen !== map.isOnScreen(this.x, this.y, this.width, this.height)) {
        this.isOnScreen = !this.isOnScreen;
    }
    this.timer++;
    if (this.timer > this.timeToLive) {
        if (!this.isOnScreen) {
            this.deletePokemon();
        }
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
        };
        if (this.y < pos.y) {
            this.y += Math.min(this.speed, Math.abs(pos.y - this.y));
        };
        if (this.x > pos.x) {
            this.x -= Math.min(this.speed, Math.abs(pos.x - this.x));
        };
        if (this.x < pos.x) {
            this.x += Math.min(this.speed, Math.abs(pos.x - this.x));
        };

        if (pos.x === this.x && pos.y === this.y) {
            this.path.splice(0, 1)
        };
    }
    else {
        if (Math.trunc(Math.random() * 100) === 1) {
            const dest = map.getRandomPosition(this.x, this.y, 10000);
            this.goTo(map, map.positionInGrid(dest.x, dest.y));
        }
    }
}
// function move(map, player) {
//     const distX = (player.x + player.width / 2) - (this.x + this.width / 2);
//     const distY = (player.y + player.height / 2) - (this.y + this.height / 2);
//     let distSum = Math.abs(distX) + Math.abs(distY);
//     distSum = distSum === 0 ? 1 : distSum;
//     if (!this.isScared) {
//         const dist = Math.sqrt(Math.pow(distX, 2) + Math.pow(distY, 2));
//         if (dist > this.scareRadius) {
//             this.x += (distX / distSum) * this.speed;
//             this.y += (distY / distSum) * this.speed;
//         }
//         else {
//             this.isScared = true;
//         }
//     }
//     else {
//         if (this.scareTimer < this.scareTime) {
//             this.scareTimer++;
//         }
//         else {
//             this.x += (distX / distSum) * -this.speed;
//             this.y += (distY / distSum) * -this.speed;
//             if (!map.isOnScreen(this.x, this.y, this.width, this.height)) {
//                 this.x = 0;
//                 this.y = 0;
//                 this.isScared = false;
//                 this.scareTimer = 0;
//                 this.isActive = false;
//             }
//         }
//     }
//     // map.handleCollision(this);
// }
// function spawn(map) {
//     this.spawnTimer++;
//     if (this.spawnTimer > this.spawnTime) {
//         this.spawnTimer = 0;
//         const spawnPos = map.getPositionOffScreen();
//         this.x = spawnPos.x;
//         this.y = spawnPos.y;
//         this.pokemon = createSimplePokemon(allPokemon[Math.trunc(Math.random() * allPokemon.length)].id);
//         this.div.style.backgroundImage = `url("${findPokemon(this.pokemon.id).sprites["front_default"]}")`;
//         this.isActive = true;
//     }
// }
