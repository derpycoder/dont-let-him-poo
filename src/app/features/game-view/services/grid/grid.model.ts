import { EventEmitter } from '@angular/core';

export const TILE_TYPES = {
    WALL: "wall",
    POOP: "poop",
    NONE: "none",
    LOO: "loo",

    PIZZA: "pizza",
    MONEY: "money",

    PLAYER: "player"
};

export class CellData {
    tileType: string;
}
export class Vector {
    x: number;
    y: number;
}
