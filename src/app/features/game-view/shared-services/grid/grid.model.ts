import { EventEmitter } from '@angular/core';

export const TILE_TYPES = {
    wall: "wall",
    poop: "poop",
    none: "none",
    loo: "loo",

    pizza: "pizza",
    money: "money",

    player: "player"
};

export class Vector {
    x: number;
    y: number;
}
