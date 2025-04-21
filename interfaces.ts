//map, player, companion, npc, pokemon, backpack

import { FunctionExpression } from "@babel/types";
import { ObjectId } from "mongodb";
import { Url } from "url";



export interface User {
  _id?: ObjectId,
  username: string,
  email: string,
  password: string,
}


export interface Pokemon {
  abilities: {
    name: string,
    url: string,
  },
  base_experience: number,
  cries: {
    lattest: string,
    legacy: string,
  },
  id: number,
  is_default: boolean,
  moves: {
    name: string,
    url: string,
  }[],
  name: string,
  species: {
    name: string,
    url: string,
  },
  sprites: {
    front_default: string,
    back_default: string,
    front_shiny: string,
    back_shiny: string,
  },
  stats: {
    base_stat: number,
    effort: number,
    stat: {
      name: string,
      url: string,
    },
  }[]
  types: {
    slot: number,
    type: {
      name: string,
      url: string,
    }
  }[],
  nickname: string,
  evolution_chain: {
    name: string,
    sprite: string
  }[],
  isKnown: boolean,
  isCaptured: boolean,
};


export interface Npc {
  type: string,
  div: HTMLElement,
  x: number,
  y: number,
  width: number,
  height: number,
  isOnScreen: false,
  pokemon: undefined,
  update: Function,
  assignPokemon: Function,
};



export interface WildPokemon {
  type: string,
  div: HTMLElement,
  x: number,
  y: number,
  width: number,
  height: number,
  speed: number,
  isScared: boolean,
  isActive: boolean,
  pokemon: Pokemon,
  spawnTimer: number,
  spawnTime: number,
  scareTimer: number,
  scareTime: number,
  scareRadius: number,
  update: Function,
  move: Function,
  spawn: Function,
}


export interface Map {
  div: HTMLElement,
  x: number,
  y: number,
  left: number,
  top: number,
  width: number,
  height: number,
  tileWidth: number,
  tileHeight: number,
  layerData: number[],
  collisionTiles: number[],
  npcs: Npc[],
  pokemon: [],

  update: Function,
  addObject: Function,
  centerMap: Function,
  positionInGrid: Function,
  positionInWorld: Function,
  isOnScreen: Function,
  getPositionOnScreen: Function,
  getPositionOffScreen: Function,
  handleCollision: Function,

}

export interface Companion {

  div: HTMLElement,
  x: number,
  y: number,
  width: number,
  height: number,
  speed: number,
  pokemon: Pokemon,
  owner: Player,

  isDebugOn: Boolean,

  update: Function,
  move: Function,
  setCompanion: Function,
  removeCompanion: Function,
  toggleDebug: Function,
  debug: Function,
}

export interface Player {
  div: HTMLElement,
  x: number,
  y: number,
  width: number,
  height: number,
  speed: number,
  velocityX: number,
  velocityY: number,
  isMovingUp: boolean,
  isMovingDown: boolean,
  isMovingLeft: boolean,
  isMovingRight: boolean,
  direction: string,
  spriteIndex: number,
  hasCompanion: boolean,
  companion: Companion,
  capturedPokemon: Pokemon[],
  isInBattle: Boolean,
  isInEvent: Boolean,
  isDebugOn: Boolean,

  update: Function,
  moveUp: Function,
  moveRight: Function,
  moveDown: Function,
  moveLeft: Function,
  move: Function,
  setDirection: Function,
  setCompanion: Function,
  capturePokemon: Function,
  removeCompanion: Function,
  releasePokemon: Function,
  interact: Function,
  interactNpc: Function,
  interactPokemon: Function,
  battle: Function,
  capture: Function,
  toggleDebug: Function,
  debug: Function,
}

export interface Backpack {
  player: Player,
  backpackIcon: HTMLElement,
  backpackBtns: HTMLCollection,
  backpackMenu: HTMLElement,
  previousMenu: HTMLElement[],
  currentMenu: HTMLElement,
  menuEvents: {
    event: HTMLElement,
    title: string,
    open: Function,
    close: Function
  }
  openMenu: Function,
  closeMenu: Function,
  openEvent: Function,
  closeAllEvents: Function,
  backbuttonPressed: Function,
  openMainMenu: Function,
  openCompareSide: Function,
  createPokemonList: Function,
  openBattleEvent: Function,
  closeBattleEvent: Function,
  openCaptureEvent: Function,
  closeCaptureEvent: Function,
}