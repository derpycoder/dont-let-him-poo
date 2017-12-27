export enum PLAYER_TYPES {
  NONE,
  SLEEPING,
  HAPPY,
  NAUSEATED,
  GOT_FED,
  GOT_MONEY,
  TARGET_ACQUIRED,
  ANGRY
}

export enum PLAYER_MOVES {
  NORMAL,
  DIAGONAL,
  DIAGONAL_HOP
}

export class Vector {
  x: number;
  y: number;
}

export class Measurements {
  cellSize: number;
  cellMargin: number;
  gridContainerPadding: number;
}

export enum BREAKPOINTS {
  DESKTOP = 1,
  MOBILE = 2
}

export enum GAME_STATES {
  LOAD,
  START,
  RUN,
  RUNNING,
  GAME_OVER,
  EDIT_MODE
}
