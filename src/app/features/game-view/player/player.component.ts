import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  ChangeDetectorRef
} from "@angular/core";

import { TimelineMax, TweenMax } from "gsap";

import { Node } from "../services/grid/grid.model";
import { GridService } from "../services/grid/grid.service";
import { PathFindingService } from "../services/path-finding/path-finding.service";
import { PLAYER_TYPES } from "../services/choreographer/choreographer.model";

import { ChoreographerService } from "../services/choreographer/choreographer.service";
import {
  Measurements,
  Vector,
  GAME_STATES
} from "../services/choreographer/choreographer.model";
import { TILE_TYPES } from "../services/grid/grid.model";

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

  constructor(
    private pathFindingService: PathFindingService,
    private gridService: GridService,
    private choreographerService: ChoreographerService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.choreographerService.onPlayerPlaced.subscribe((position: Node) => {
      this.playerGridPos.x = position.x;
      this.playerGridPos.y = position.y;

      // console.log("Grid Position: ", this.playerGridPos);
      this.setPlayerPosition();
    });

    this.choreographerService.onPathChange.subscribe((path: Node[]) => {
      this.path = path;

      if (this.choreographerService.currentGameState === GAME_STATES.RUNNING) {
        this.animatePlayer();
      }
    });

    this.choreographerService.onMeasurementsChange.subscribe(
      (measurements: Measurements) => {
        this.measurements = measurements;
        // console.log("Measurements: ", this.measurements);
        this.setPlayerPosition();
      }
    );

    this.choreographerService.onGameStateChange.subscribe(state => {
      switch (state) {
        case GAME_STATES.START:
          this.playerType = PLAYER_TYPES.NONE;
          break;
        case GAME_STATES.RUN:
          this.playerType = PLAYER_TYPES.SLEEPING;
          break;
        case GAME_STATES.RUNNING:
          this.animatePlayer();
          break;
        default:
      }
    });
  }

  animatePlayer() {
    if (!this.path || !this.measurements || !this.playerGridPos) {
      return;
    }
    TweenMax.killAll();
    const tl = new TimelineMax();

    this.path.forEach(node => {
      const targetPos = this.calculatePixelPosition({
        x: node.x,
        y: node.y
      });

      tl
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
          this.choreographerService.player.tileType = TILE_TYPES.NONE;
          node.tileType = TILE_TYPES.PLAYER;
          this.choreographerService.player = node;
        });

      tl.play();
    });
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
