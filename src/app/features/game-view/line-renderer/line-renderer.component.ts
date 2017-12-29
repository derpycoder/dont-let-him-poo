import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef
} from "@angular/core";
import { Subscription } from "rxjs/Subscription";

import { Node } from "../services/grid/grid.model";
import { ChoreographerService } from "../services/choreographer/choreographer.service";
import {
  Measurements,
  Vector,
  GAME_STATES
} from "../services/choreographer/choreographer.model";

@Component({
  selector: "dlp-line-renderer",
  templateUrl: "./line-renderer.component.html",
  styleUrls: ["./line-renderer.component.css"]
})
export class LineRendererComponent implements OnInit, OnDestroy {
  @ViewChild("polyLine") polyLine: ElementRef;

  pathString: string;
  game_states = GAME_STATES;

  private path: Node[];
  private measurements: Measurements;
  private timer: any;

  // Subscriptions
  private onPathChangeSubscription: Subscription;
  private onMeasurementChangeSubscription: Subscription;
  private onGameStateChangeSubscription: Subscription;
  private onPlayerMoveSubscription: Subscription;

  constructor(public choreographerService: ChoreographerService) {}

  ngOnInit() {
    this.onPathChangeSubscription = this.choreographerService.onPathChange.subscribe(
      (path: Node[]) => {
        this.path = path;
        if (
          this.choreographerService.currentGameState === GAME_STATES.RUNNING
        ) {
          this.renderPath();
        }
      }
    );

    this.onMeasurementChangeSubscription = this.choreographerService.onMeasurementsChange.subscribe(
      (measurements: Measurements) => {
        this.measurements = measurements;
        if (
          this.choreographerService.currentGameState === GAME_STATES.RUNNING
        ) {
          this.renderPath();
        }
      }
    );

    this.onGameStateChangeSubscription = this.choreographerService.onGameStateChange.subscribe(
      (state: GAME_STATES) => {
        if (state === GAME_STATES.RUNNING) {
          this.path = this.choreographerService.path;
          this.renderPath();
        }
      }
    );

    this.onPlayerMoveSubscription = this.choreographerService.onPlayerMove.subscribe(
      $ => {
        if (
          this.choreographerService.currentGameState === GAME_STATES.RUNNING
        ) {
          this.renderPath();
        }
      }
    );
  }

  ngOnDestroy() {
    if (this.onGameStateChangeSubscription) {
      this.onGameStateChangeSubscription.unsubscribe();
    }

    if (this.onMeasurementChangeSubscription) {
      this.onMeasurementChangeSubscription.unsubscribe();
    }

    if (this.onPathChangeSubscription) {
      this.onPathChangeSubscription.unsubscribe();
    }

    if (this.onPlayerMoveSubscription) {
      this.onPlayerMoveSubscription.unsubscribe();
    }
  }

  renderPath() {
    if (!this.path) {
      return;
    }

    const pathArr: string[] = this.path.map((node: Node) => {
      const pixelPos = this.calculatePixelPosition(node);
      return `${pixelPos.y},${pixelPos.x}`;
    });

    this.pathString = pathArr.join(" ");
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
