import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";

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
export class LineRendererComponent implements OnInit {
  @ViewChild("polyLine") polyLine: ElementRef;

  pathString: string;
  game_states = GAME_STATES;

  private path: Node[];
  private measurements: Measurements;
  private timer: any;

  constructor(public choreographerService: ChoreographerService) {}

  ngOnInit() {
    this.choreographerService.onPathChange.subscribe((path: Node[]) => {
      this.path = path;
      if (this.choreographerService.currentGameState === GAME_STATES.RUNNING) {
        this.renderPath();
      }
    });

    this.choreographerService.onMeasurementsChange.subscribe(
      (measurements: Measurements) => {
        this.measurements = measurements;
        if (this.choreographerService.currentGameState === GAME_STATES.RUNNING) {
          this.renderPath();
        }
      }
    );

    this.choreographerService.onGameStateChange.subscribe(
      (state: GAME_STATES) => {
        if (state === GAME_STATES.RUNNING) {
          this.renderPath();
        }
      }
    );
  }

  renderPath() {
    clearInterval(this.timer);
    if (!this.path || !this.measurements) {
      return;
    }

    const pathArr: string[] = this.path.map((node: Node) => {
      const pixelPos = this.calculatePixelPosition(node);
      return `${pixelPos.y},${pixelPos.x}`;
    });
    
    this.pathString = pathArr.join(" ");

    this.timer = setInterval($ => {
      if (pathArr.length < 1) {
        clearInterval(this.timer);
      }
      pathArr.splice(0, 1);
      this.pathString = pathArr.join(" ");
    }, 500);
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
