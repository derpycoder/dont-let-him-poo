import { EventEmitter } from '@angular/core';

export enum TILE_TYPES {
    NONE, WALL,
    PIZZA, BURGER, POOP, WIDE_EYED_POOP,
    PLAYER,
    LOO
}

export class CellData {
    x: number;
    y: number;
    tileType: TILE_TYPES;
}

export class Vector {
    x: number;
    y: number;
}
