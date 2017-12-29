import {
  Component,
  OnInit,
  OnDestroy,
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
import { Subscription } from "rxjs/Subscription";

@Component({
  selector: "dlp-player",
  templateUrl: "./player.component.html",
  styleUrls: ["./player.component.css"]
})
export class PlayerComponent implements OnInit, OnDestroy {
  @ViewChild("player") playerRef: ElementRef;

  playerPixelPos: Vector = new Vector();
  playerGridPos: Vector = new Vector();

  path: Node[];

  measurements: Measurements = new Measurements();

  playerType: PLAYER_TYPES = PLAYER_TYPES.NONE;
  player_types = PLAYER_TYPES;

  tl: TimelineMax;

  // Subscriptions
  private onPlayerPlacedSubscription: Subscription;
  private onPathChangeSubscription: Subscription;
  private onMeasurementChangeSubscription: Subscription;
  private onGameStateChangeSubscription: Subscription;

  constructor(
    private pathFindingService: PathFindingService,
    private gridService: GridService,
    private choreographerService: ChoreographerService,
    private changeDetectorRef: ChangeDetectorRef,
    private salaryService: SalaryService
  ) {}

  ngOnInit() {
    this.tl = new TimelineMax();

    this.onPlayerPlacedSubscription = this.choreographerService.onPlayerPlaced.subscribe(
      (position: Node) => {
        this.playerGridPos = position;

        this.setPlayerPosition();
      }
    );

    this.onPathChangeSubscription = this.choreographerService.onPathChange.subscribe(
      (path: Node[]) => {
        this.path = path;

        if (
          this.choreographerService.currentGameState === GAME_STATES.RUNNING
        ) {
          this.animatePlayer();
        }
      }
    );

    this.onMeasurementChangeSubscription = this.choreographerService.onMeasurementsChange.subscribe(
      (measurements: Measurements) => {
        this.measurements = measurements;
        if (
          this.choreographerService.currentGameState === GAME_STATES.RUNNING
        ) {
          this.path = this.choreographerService.path;
          this.animatePlayer();
        } else {
          this.playerGridPos = this.choreographerService.player;
          this.setPlayerPosition();
        }
      }
    );

    this.onGameStateChangeSubscription = this.choreographerService.onGameStateChange.subscribe(
      state => {
        this.path = this.choreographerService.path;
        switch (state) {
          case GAME_STATES.LOAD:
            this.tl.clear();
            this.playerType = PLAYER_TYPES.NONE;
            break;
          case GAME_STATES.START:
            this.tl.clear();
            this.playerType = PLAYER_TYPES.NONE;
            break;
          case GAME_STATES.RUN:
            this.playerType = PLAYER_TYPES.SLEEPING;
            this.setPlayerPosition();
            break;
          case GAME_STATES.RUNNING:
            this.playerType = PLAYER_TYPES.HAPPY;
            this.animatePlayer();
            break;
          default:
        }
      }
    );
  }
  ngOnDestroy() {
    this.onGameStateChangeSubscription.unsubscribe();
    this.onMeasurementChangeSubscription.unsubscribe();
    this.onPathChangeSubscription.unsubscribe();
    this.onPlayerPlacedSubscription.unsubscribe();
  }

  animatePlayer() {
    // Necessary to stop previous tween, else, the player will keep moving in the previous
    // direction, and after finishing that, will continue on new path.
    this.tl.clear();

    if (
      !this.path ||
      !this.measurements ||
      !this.playerGridPos ||
      !this.playerRef
    ) {
      return;
    }

    this.playerType = PLAYER_TYPES.ANGRY;

    if (this.path.length === 0) {
      this.choreographerService.currentGameState = GAME_STATES.GAME_OVER;
      return;
    }

    this.path.forEach(node => {
      const targetPos = this.calculatePixelPosition(node);

      this.tl
        .add($ => {
          this.showExpression(node);

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
            this.choreographerService.path.shift();

            this.choreographerService.onPlayerMove.emit(true);
          }
        });

      this.tl.play();
    });
  }

  showExpression(node: Node) {
    switch (node.tileType) {
      case TILE_TYPES.LOO:
        this.playerType = PLAYER_TYPES.TARGET_ACQUIRED;
        this.choreographerService.currentGameState = GAME_STATES.GAME_OVER;
        break;
      case TILE_TYPES.PIZZA:
        this.playerType = PLAYER_TYPES.GOT_FED;
        setTimeout($ => this.choreographerService.onDistractionOver.emit(node));
        break;
      case TILE_TYPES.MONEY:
        this.playerType = PLAYER_TYPES.GOT_MONEY;
        setTimeout($ => this.choreographerService.onDistractionOver.emit(node));
        break;
      case TILE_TYPES.NONE:
        switch (this.choreographerService.targets[
          this.choreographerService.targets.length - 1
        ].tileType) {
          case TILE_TYPES.LOO:
            this.playerType = PLAYER_TYPES.HAPPY;
            break;
          case TILE_TYPES.MONEY:
            this.playerType = PLAYER_TYPES.GOT_MONEY;
            break;
          case TILE_TYPES.PIZZA:
            this.playerType = PLAYER_TYPES.GOT_FED;
            break;
        }
        break;
      case TILE_TYPES.POOP:
        this.salaryService.updateSalary(100);
        this.choreographerService.onPlayerAtePoo.emit(true);
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
    const x =
      this.measurements.gridContainerPadding +
      this.measurements.cellMargin * targetPos.x +
      this.measurements.cellSize * targetPos.x;

    const y =
      this.measurements.gridContainerPadding +
      this.measurements.cellMargin * targetPos.y +
      this.measurements.cellSize * targetPos.y;

    return { x, y };
  }
}
