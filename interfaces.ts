//map, player, companion, npc, pokemon, backpack

import { ObjectId } from "mongodb";



export interface User {
  _id?: ObjectId,
  username: string,
  email: string,
  password: string,
}


export interface Map {
  div: any,
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
  pokemon: WildPokemon[],

  update: Function,
  addObject: Function,
  centerMap: Function,
  positionInGrid: Function,
  positionInWorld: Function,
  isOnScreen: Function,
  getPosition: Function,
  getRandomPosition: Function,
  getPositionOnScreen: Function,
  getPositionOffScreen: Function,
  handleCollision: Function,
  findPath: Function,
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
  companion: any,
  capturedPokemon: Pokemon[],
  knownPokemon: number[],
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
  releasePokemon: Function,
  interact: Function,
  interactNpc: Function,
  interactPokemon: Function,
  battle: Function,
  capture: Function,
  toggleDebug: Function,
  debug: Function,
}

export interface Npc {
  type: string,
  name: string,
  div: HTMLElement,
  x: number,
  y: number,
  width: number,
  height: number,
  speed: number,
  velocityX: number,
  velocityY: number,
  direction: string,
  spriteIndex: number,
  path: number[],
  isOnScreen: boolean,
  pokemon?: Pokemon,

  update: Function,
  move: Function,
  goTo: Function,
  setDirection: Function,
  interact: Function,
};

export interface Companion {

  div: HTMLElement,
  x: number,
  y: number,
  width: number,
  height: number,
  speed: number,
  pokemon?: Pokemon,
  owner: Player,

  isDebugOn: Boolean,

  update: Function,
  move: Function,
  setCompanion: Function,
  removeCompanion: Function,
  toggleDebug: Function,
  debug: Function,
}

export interface SimplifiedPokemon {
  id: number,
  name: string,
  stats: {
    hp: number,
    maxHp: number,
    atk: number,
    def: number,
    spAtk: number,
    spDef: number,
    speed: number,
    wins: number,
    losses: number,
  }
  nickname: string,
};
export interface Pokemon {
  abilities: {
    name: string,
    url: string,
  },
  base_experience: number,
  cries: {
    latest: string,
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
  pokemon?: Pokemon,
  spawnTimer: number,
  spawnTime: number,
  scareTimer: number,
  scareTime: number,
  scareRadius: number,
  update: Function,
  move: Function,
  spawn: Function,
}

export interface Backpack {
  player: Player,
  backpackIcon: any,
  backpackBtns: HTMLCollection,
  closeBtn: any,
  backBtn: any,
  backpackMenu: any,
  previousMenu: any[],
  currentMenu?: any,
  menuEvents: {
    event: any,
    title: string,
    open: Function,
    close: Function
  }[]
  openMenu: Function,
  closeMenu: Function,
  openEvent: Function,
  closeAllEvents: Function,
  backbuttonPressed: Function,
  openMainMenu: Function,
  openCompareSide: Function,
  createPokemonList: Function,
  getFilteredList: Function,
  openBattleEvent: Function,
  closeBattleEvent: Function,
  openCaptureEvent: Function,
  closeCaptureEvent: Function,
}

export interface projectPicture{
  background: string;
  logo: string;
  logoBgColor: string;
}

