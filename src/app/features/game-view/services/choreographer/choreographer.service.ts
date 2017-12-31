import { Injectable, EventEmitter } from "@angular/core";

import { Measurements, BREAKPOINTS, GAME_STATES } from "./choreographer.model";
import { GridService } from "../grid/grid.service";
import { Node, TILE_TYPES } from "../grid/grid.model";

import { UtilsService } from "../utils.service";
import { PathFindingService } from "../path-finding/path-finding.service";

@Injectable()
export class ChoreographerService {
  onGameStateChange: EventEmitter<GAME_STATES> = new EventEmitter<
    GAME_STATES
  >();
  onMeasurementsChange: EventEmitter<Measurements> = new EventEmitter<
    Measurements
  >();
  onPlayerPlaced: EventEmitter<Node> = new EventEmitter<Node>();
  onPathChange: EventEmitter<Node[]> = new EventEmitter<Node[]>();

  onPlayerMove: EventEmitter<boolean> = new EventEmitter<boolean>();

  onPlayerAtePoo: EventEmitter<boolean> = new EventEmitter<boolean>();
  onDistractionOver: EventEmitter<Node> = new EventEmitter<Node>();

  player: Node;
  targets: Node[];
  private poo: Node;
  private crucialMeasurements: Measurements;
  public path: Node[];

  private _currentGameState: GAME_STATES = GAME_STATES.LOAD;
  get currentGameState(): GAME_STATES {
    return this._currentGameState;
  }
  set currentGameState(value: GAME_STATES) {
    this._currentGameState = value;
    this.onGameStateChange.emit(value);
  }

  constructor(
    private gridService: GridService,
    private utilsService: UtilsService,
    private pathFindingService: PathFindingService
  ) {
    this.gridService.onGridReady.subscribe(status => {
      if (status) {
        this.currentGameState = GAME_STATES.START;
        this.cleverlyPlacePlayerLooAndPoo();
      } else {
        this.currentGameState = GAME_STATES.LOAD_FAILED;
      }
    });

    this.onPlayerAtePoo.subscribe($ => {
      this.generatePoo();
    });

    this.onDistractionOver.subscribe((distraction: Node) => {
      this.distractionOver(distraction);
    });
  }

  private cleverlyPlacePlayerLooAndPoo() {
    this.targets = [];

    let playerPlaced: boolean, looPlaced: boolean, pooPlaced: boolean;
    let tmpPlayer: Node, tmpLoo: Node, tmpPoo: Node;

    let i, j, x, y, p, q;

    let count = 0;

    while (count < 100) {
      console.log(`Tries: ${count++}`);

      if (!playerPlaced) {
        i = this.utilsService.getRandomNumber(0, 10);
        j = this.utilsService.getRandomNumber(0, 10);
      }
      if (!looPlaced) {
        x = this.utilsService.getRandomNumber(0, 10);
        y = this.utilsService.getRandomNumber(0, 10);
      }
      if (!pooPlaced) {
        p = this.utilsService.getRandomNumber(0, 10);
        q = this.utilsService.getRandomNumber(0, 10);
      }

      if (
        !playerPlaced &&
        this.gridService.gameGrid[i][j].tileType === TILE_TYPES.NONE
      ) {
        tmpPlayer = this.gridService.gameGrid[i][j];
        playerPlaced = true;
      }

      if (
        !looPlaced &&
        this.gridService.gameGrid[x][y].tileType === TILE_TYPES.NONE
      ) {
        tmpLoo = this.gridService.gameGrid[x][y];
        looPlaced = true;
      }

      if (
        !pooPlaced &&
        this.gridService.gameGrid[p][q].tileType === TILE_TYPES.NONE
      ) {
        tmpPoo = this.gridService.gameGrid[p][q];
        pooPlaced = true;
      }

      if (playerPlaced && looPlaced && pooPlaced) {
        this.path = this.pathFindingService.findPath(tmpPlayer, tmpLoo);

        if (
          this.path &&
          this.path.length > 5 &&
          this.path.indexOf(tmpPoo) === -1
        ) {
          this.player = tmpPlayer;
          this.player.tileType = TILE_TYPES.PLAYER;

          tmpLoo.tileType = TILE_TYPES.LOO;
          this.targets.push(tmpLoo);

          this.poo = tmpPoo;
          this.poo.tileType = TILE_TYPES.POOP;

          this.onPlayerPlaced.emit(this.player);
          this.onPathChange.emit(this.path);

          return;
        }
        playerPlaced = looPlaced = pooPlaced = false;
      }
    }
  }

  generatePoo() {
    let pooPlaced: boolean;
    let tmpPoo: Node;
    let p, q;

    let count = 0;

    while (count < 50) {
      console.log(`Poo Tries: ${count++}`);

      p = this.utilsService.getRandomNumber(0, 10);
      q = this.utilsService.getRandomNumber(0, 10);

      if (
        !pooPlaced &&
        this.gridService.gameGrid[p][q].tileType === TILE_TYPES.NONE
      ) {
        tmpPoo = this.gridService.gameGrid[p][q];

        if (this.path.indexOf(tmpPoo) !== -1) {
          continue;
        }

        const path = this.pathFindingService.findPath(this.player, tmpPoo);

        if (path && path.length > 5) {
          this.poo = tmpPoo;
          pooPlaced = true;
          this.poo.tileType = TILE_TYPES.POOP;
          return;
        }
      }
    }
  }

  distractionPlaced(target: Node) {
    this.targets.push(target);

    this.path = this.pathFindingService.findPath(
      this.player,
      this.targets[this.targets.length - 1]
    );
    this.onPathChange.emit(this.path);
  }

  distractionOver(target: Node) {
    if (this.targets.length < 0) {
      return;
    }

    const index = this.targets.indexOf(target);
    if (index === -1) {
      return;
    }

    this.targets.splice(index, 1);

    this.path = this.pathFindingService.findPath(
      this.player,
      this.targets[this.targets.length - 1]
    );
    this.onPathChange.emit(this.path);
  }

  takeMeasurements(token: number) {
    switch (token) {
      case BREAKPOINTS.DESKTOP:
        this.crucialMeasurements = {
          cellSize: 37,
          cellMargin: 4,
          gridContainerPadding: 20
        };
        break;
      case BREAKPOINTS.MOBILE:
        this.crucialMeasurements = {
          cellSize: 24,
          cellMargin: 2,
          gridContainerPadding: 9
        };
        break;
    }

    this.onMeasurementsChange.emit(this.crucialMeasurements);
  }

  checkPathCollision(roadBlock: Node) {
    if (!this.path) {
      return;
    }

    const path = this.pathFindingService.findPath(
      this.player,
      this.targets[this.targets.length - 1]
    );

    if (this.path.indexOf(roadBlock) !== -1 || path.length < this.path.length) {
      this.path = path;
      if (this.path) {
        this.onPathChange.emit(this.path);
      }
    }
  }
}
