import {Player} from "./player.js";
import {Map} from "./map.js";
import { Companion } from "./companion.js";

addEventListener("keydown", (e) => {
    if (e.keyCode === 87/*w*/) { Player.moveUp(); };
    if (e.keyCode === 65/*a*/) { Player.moveLeft(); };
    if (e.keyCode === 83/*s*/) { Player.moveDown(); };
    if (e.keyCode === 68/*d*/) { Player.moveRight(); };
    if (e.keyCode === 79/*o*/) {toggleDebug() };
});
setInterval(()=>{
    Player.update();
    Companion.update();
    Map.update();
},50);


function toggleDebug(){
    Player.toggleDebug();
    Companion.toggleDebug();
}