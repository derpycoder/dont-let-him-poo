import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  ChangeDetectorRef
} from "@angular/core";

import { TimelineMax } from "gsap";

import { Node, TILE_TYPES } from "../services/grid/grid.model";
import { GridService } from "../services/grid/grid.service";
import { PathFindingService } from "../services/path-finding/path-finding.service";
import { PLAYER_TYPES } from "../services/choreographer/choreographer.model";

import { ChoreographerService } from "../services/choreographer/choreographer.service";
import {
  Measurements,
  Vector,
  GAME_STATES
} from "../services/choreographer/choreographer.model";

import { SalaryService } from "../services/salary.service";

@Component({
  selector: "dlp-player",
  templateUrl: "./player.component.html",
  styleUrls: ["./player.component.css"]
})
export class PlayerComponent implements OnInit {
  @ViewChild("player") playerRef: ElementRef;

  playerPixelPos: Vector = new Vector();
  playerGridPos: Vector = new Vector();

  path: Node[];

  measurements: Measurements = new Measurements();

  playerType: PLAYER_TYPES = PLAYER_TYPES.NONE;
  player_types = PLAYER_TYPES;

  tl: TimelineMax;

  constructor(
    private pathFindingService: PathFindingService,
    private gridService: GridService,
    private choreographerService: ChoreographerService,
    private changeDetectorRef: ChangeDetectorRef,
    private salaryService: SalaryService
  ) {}

  ngOnInit() {
    this.tl = new TimelineMax();

    this.choreographerService.onPlayerPlaced.subscribe((position: Node) => {
      this.playerGridPos.x = position.x;
      this.playerGridPos.y = position.y;

      this.setPlayerPosition();
    });

    this.choreographerService.onPathChange.subscribe((path: Node[]) => {
      this.path = path;

      if (this.choreographerService.currentGameState === GAME_STATES.RUNNING) {
        this.animatePlayer(true);
      }
    });

    this.choreographerService.onMeasurementsChange.subscribe(
      (measurements: Measurements) => {
        this.measurements = measurements;
        if (
          this.choreographerService.currentGameState === GAME_STATES.RUNNING
        ) {
          this.animatePlayer(false);
        } else if (
          this.choreographerService.currentGameState === GAME_STATES.GAME_OVER
        ) {
          this.playerGridPos = this.choreographerService.player;
        }
        this.setPlayerPosition();
      }
    );

    this.choreographerService.onGameStateChange.subscribe(state => {
      switch (state) {
        case GAME_STATES.START:
          this.tl.kill();
          this.tl.clear();
          this.playerType = PLAYER_TYPES.NONE;
          break;
        case GAME_STATES.RUN:
          this.playerType = PLAYER_TYPES.SLEEPING;
          this.setPlayerPosition();
          break;
        case GAME_STATES.RUNNING:
          this.playerType = PLAYER_TYPES.HAPPY;
          this.animatePlayer(false);
          break;
        default:
      }
    });
  }

  animatePlayer(awardPlayer: boolean) {
    if (!this.path || !this.measurements || !this.playerGridPos) {
      return;
    }

    this.tl.kill();
    this.tl.clear();

    if(awardPlayer) {
      this.salaryService.updateSalary(10);
      this.playerType = PLAYER_TYPES.ANGRY;
    }
    
    if (this.path.length === 0) {
      this.choreographerService.currentGameState = GAME_STATES.GAME_OVER;
      return;
    }

    this.path.forEach(node => {
      const targetPos = this.calculatePixelPosition({
        x: node.x,
        y: node.y
      });

      this.tl
        .add($ => {
          this.showExpression(node.tileType);

          this.choreographerService.player.tileType = TILE_TYPES.NONE;
          node.tileType = TILE_TYPES.PLAYER;
          this.choreographerService.player = node;
        })
        .to(this.playerRef.nativeElement, 0.5, {
          left: targetPos.y,
          top: targetPos.x
        })
        .to(
          this.playerRef.nativeElement,
          0.25,
          {
            scale: 1.2
          },
          "-=0.5"
        )
        .to(
          this.playerRef.nativeElement,
          0.25,
          {
            scale: 1
          },
          "-=0.25"
        )
        .add($ => {
          if (this.playerType !== PLAYER_TYPES.TARGET_ACQUIRED) {
            this.playerType = PLAYER_TYPES.HAPPY;
          }
        });

      this.tl.play();
    });
  }

  showExpression(tileType) {
    switch (tileType) {
      case TILE_TYPES.LOO:
        this.playerType = PLAYER_TYPES.TARGET_ACQUIRED;
        this.choreographerService.currentGameState = GAME_STATES.GAME_OVER;
        break;
      case TILE_TYPES.PIZZA:
        this.playerType = PLAYER_TYPES.GOT_FED;
        break;
      case TILE_TYPES.MONEY:
        this.playerType = PLAYER_TYPES.GOT_MONEY;
        break;
      case TILE_TYPES.NONE:
        this.playerType = PLAYER_TYPES.HAPPY;
        break;
      case TILE_TYPES.POOP:
        this.salaryService.updateSalary(100);
        this.playerType = PLAYER_TYPES.NAUSEATED;
        break;
    }
  }

  setPlayerPosition() {
    if (!this.measurements || !this.playerGridPos) {
      return;
    }

    this.playerPixelPos = this.calculatePixelPosition(this.playerGridPos);
  }

  calculatePixelPosition(targetPos: Vector): Vector {
    // console.log(this.measurements);

    const x =
      this.measurements.gridContainerPadding +
      this.measurements.cellMargin * targetPos.x +
      this.measurements.cellSize * targetPos.x;

    const y =
      this.measurements.gridContainerPadding +
      this.measurements.cellMargin * targetPos.y +
      this.measurements.cellSize * targetPos.y;

    // console.log("Calculated Pixel Pos: ", x, y);

    return { x, y };
  }
}
