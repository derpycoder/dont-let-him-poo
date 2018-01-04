import { Injectable, EventEmitter } from "@angular/core";

import { Measurements, BREAKPOINTS, GAME_STATES } from "./choreographer.model";
import { GridService } from "../grid/grid.service";
import { Node, TILE_TYPES } from "../grid/grid.model";

import { UtilsService } from "../utils.service";
import { PathFindingService } from "../path-finding/path-finding.service";
import { GoogleAnalyticsService } from "../../../../shared/";
import { Vector } from "./choreographer.model";
import { SalaryService } from "../salary.service";
import { InteractionService } from "../interaction.service";

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

  onDistractionPlaced: EventEmitter<Node> = new EventEmitter<Node>();
  onRoadBlockPlaced: EventEmitter<Node> = new EventEmitter<Node>();
  onTilePlaced: EventEmitter<Node> = new EventEmitter<Node>();

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

    this.onStateChange();
  }

  constructor(
    private gridService: GridService,
    private utilsService: UtilsService,
    private pathFindingService: PathFindingService,
    private googleAnalyticsService: GoogleAnalyticsService,
    private salaryService: SalaryService,
    private interactionService: InteractionService
  ) {
    this.gridService.onGridReady.subscribe(status => {
      if (status) {
        this.currentGameState = GAME_STATES.START;
        this.cleverlyPlacePlayerAndLoo();
      } else {
        this.currentGameState = GAME_STATES.LOAD_FAILED;
      }
    });

    this.onPlayerAtePoo.subscribe($ => {
      $ => this.generatePoo();
    });

    this.onDistractionPlaced.subscribe((distraction: Node) => {
      this.distractionPlaced(distraction);
    });

    this.onDistractionOver.subscribe((distraction: Node) => {
      this.distractionOver(distraction);
    });

    this.onRoadBlockPlaced.subscribe((roadblock: Node) => {
      this.checkPathCollision(roadblock);
    });

    this.onTilePlaced.subscribe((node: Node) => {
      this.updateEmptySpaces(node);
    });

    this.onPlayerPlaced.subscribe((node: Node) => {
      this.generatePoo();
    });
  }

  private onStateChange() {
    switch (this.currentGameState) {
      case GAME_STATES.LOAD:
        this.salaryService.salary = 0;
    }
  }

  private updateEmptySpaces(node: Node) {
    if (node.tileType === TILE_TYPES.NONE) {
      this.gridService.gridEmptySpaces[node.x].push(node);
    } else {
      this.gridService.gridEmptySpaces[node.x].splice(
        this.gridService.gridEmptySpaces[node.x].indexOf(node),
        1
      );
    }
  }

  getRandomEmptyNode(): Node {
    const emptySpace: Vector = new Vector();

    let count = 0;

    while (count < 10) {
      console.log(`Random: ${count++}`);

      emptySpace.x = this.utilsService.getRandomNumber(0, 10);

      if (this.gridService.gridEmptySpaces[emptySpace.x].length > 0) {
        emptySpace.y = this.utilsService.getRandomNumber(
          0,
          this.gridService.gridEmptySpaces[emptySpace.x].length - 1
        );

        if (
          this.gridService.gridEmptySpaces[emptySpace.x][emptySpace.y]
            .tileType !== TILE_TYPES.NONE
        ) {
          continue;
        }

        break;
      }
    }

    return this.gridService.gridEmptySpaces[emptySpace.x][emptySpace.y];
  }

  private cleverlyPlacePlayerAndLoo() {
    this.targets = [];

    let playerPlaced: boolean, looPlaced: boolean;
    let tmpPlayer: Node, tmpLoo: Node;

    let count = 0;

    while (count < 10) {
      console.log(`Player & Loo: ${count++}`);

      if (!playerPlaced) {
        tmpPlayer = this.getRandomEmptyNode();
        playerPlaced = true;
      }

      if (!looPlaced) {
        tmpLoo = this.getRandomEmptyNode();
        looPlaced = true;
      }

      if (playerPlaced && looPlaced) {
        this.path = this.pathFindingService.findPath(tmpPlayer, tmpLoo);

        if (this.path && this.path.length > 5) {
          this.player = tmpPlayer;
          this.player.tileType = TILE_TYPES.PLAYER;

          tmpLoo.tileType = TILE_TYPES.LOO;
          this.targets.push(tmpLoo);

          this.onPlayerPlaced.emit(this.player);
          this.onPathChange.emit(this.path);

          this.updateEmptySpaces(this.player);
          this.updateEmptySpaces(this.targets[this.targets.length - 1]);

          return;
        }
        playerPlaced = looPlaced = false;
      }
    }
  }

  generatePoo() {
    let pooPlaced: boolean;
    let tmpPoo: Node;

    let count = 0;

    while (count < 10) {
      console.log(`Poo: ${count++}`);

      if (!pooPlaced) {
        tmpPoo = this.getRandomEmptyNode();

        if (!tmpPoo || this.path.indexOf(tmpPoo) !== -1) {
          continue;
        }
        
        this.poo = tmpPoo;
        pooPlaced = true;
        this.poo.tileType = TILE_TYPES.POOP;

        this.updateEmptySpaces(this.poo);
        return;
      }
    }

    if (count === 10) {
      this.currentGameState = GAME_STATES.GAME_OVER;
    }
  }

  distractionPlaced(target: Node) {
    this.targets.push(target);
    this.updateEmptySpaces(this.targets[this.targets.length - 1]);

    this.path = this.pathFindingService.findPath(
      this.player,
      this.targets[this.targets.length - 1]
    );

    this.onPathChange.emit(this.path);

    this.googleAnalyticsService.emitEvent(
      "Distraction",
      target.tileType.charAt(0).toUpperCase() + target.tileType.slice(1),
      null,
      this.gridService.fileNumber
    );
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
