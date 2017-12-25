import { EventEmitter } from "@angular/core";

export const TILE_TYPES = {
  WALL: "wall",
  POOP: "poop",
  NONE: "none",
  LOO: "loo",

  PIZZA: "pizza",
  MONEY: "money",

  PLAYER: "player"
};

export class Node {
  x: number;
  y: number;
  tileType: string;

  f?: number;
  g?: number;
  h?: number;
  opened?: boolean;
  closed?: boolean;
  parent?: Node;
}
