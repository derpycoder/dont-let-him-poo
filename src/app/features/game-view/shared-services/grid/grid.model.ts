import { EventEmitter } from '@angular/core';

export const TILE_TYPES = {
    wall: "wall",
    brown_poop: "brown_poop",
    none: "none",
    loo: "loo",

    pink_poop: "pink_poop",
    pizza: "pizza",
    money: "money",

    player: "player"
};

export class Vector {
    x: number;
    y: number;
}
