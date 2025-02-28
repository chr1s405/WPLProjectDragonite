import {Player} from "./gameObjects/player.js";
import {Map} from "./gameObjects/map.js";
import { Companion } from "./gameObjects/companion.js";
import { GetPokemon } from "./api.js";

GetPokemon();

addEventListener("keydown", (e) => {
    if (e.keyCode === 87/*w*/) { Player.moveUp(); };
    if (e.keyCode === 65/*a*/) { Player.moveLeft(); };
    if (e.keyCode === 83/*s*/) { Player.moveDown(); };
    if (e.keyCode === 68/*d*/) { Player.moveRight(); };
    if (e.keyCode === 79/*o*/) { toggleDebug() };
});
setInterval(()=>{
    Player.update();
    Companion.update();
    Map.update();
},45);

function toggleDebug(){
    Player.toggleDebug();
    Companion.toggleDebug();
}