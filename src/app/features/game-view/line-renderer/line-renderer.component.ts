import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";

import { Observable } from 'rxjs/Rx';
import { Subscription } from "rxjs/Subscription";

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

  svgPathSettings = {
    pathString: "",
    pathLength: 0,
    pathOffset: 0
  };

  showPolyLine: boolean;
  timer: Subscription;

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

    let pathArr: string[] = this.path.map((node: Node) => {
      let pixelPos = this.calculatePixelPosition(node);
      return `${pixelPos.y},${pixelPos.x}`;
    });

    this.svgPathSettings.pathString = pathArr.join(" ");

    this.tl.kill();
    this.tl.clear();

    this.svgPathSettings.pathOffset = this.polyLine
      ? this.polyLine.nativeElement.getTotalLength()
      : 0;

    setTimeout($ => {
      if (this.polyLine) {
        this.svgPathSettings.pathOffset = this.svgPathSettings.pathLength = this.polyLine.nativeElement.getTotalLength();

        this.tl.to(this.svgPathSettings, 0.5, { pathOffset: 0 });

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
