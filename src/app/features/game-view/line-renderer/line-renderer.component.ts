import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";

import { TimelineMax } from "gsap";

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

  path: Node[];
  pathString: string;
  measurements: Measurements;

  game_states = GAME_STATES;

  tl: TimelineMax;

  constructor(public choreographerService: ChoreographerService) {}

  ngOnInit() {
    this.tl = new TimelineMax();
    this.choreographerService.onPathChange.subscribe((path: Node[]) => {
      this.path = path;
      this.renderPath();
    });

    this.choreographerService.onMeasurementsChange.subscribe(
      (measurements: Measurements) => {
        this.measurements = measurements;
        this.renderPath();
      }
    );
  }

  renderPath() {
    if (!this.path || !this.measurements) {
      return;
    }

    const pathArr: string[] = this.path.map((node: Node) => {
      let pixelPos = this.calculatePixelPosition(node);
      return `${pixelPos.y},${pixelPos.x}`;
    });

    this.pathString = pathArr.join(" ");

    this.path.forEach(node => {
      const targetPos = this.calculatePixelPosition({
        x: node.x,
        y: node.y
      });

      this.tl.kill();
      this.tl.clear();

      if (this.polyLine) {
        this.tl.to(this.polyLine.nativeElement, 0.5, {
          dashoffset: 10
        });

        this.tl.play();
      }
    });
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
