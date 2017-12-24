import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  ChangeDetectorRef
} from "@angular/core";

import { TimelineMax } from "gsap";

import { Node } from "../services/grid/grid.model";
import { GridService } from "../services/grid/grid.service";
import { PathFindingService } from "../services/path-finding/path-finding.service";
import { PLAYER_TYPES } from "../services/choreographer/choreographer.model";
import { SourceAndDestination } from "../services/grid/grid.model";

import { ChoreographerService } from "../services/choreographer/choreographer.service";
import {
  Measurements,
  Vector
} from "../services/choreographer/choreographer.model";

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

  animatedOnce: boolean;

  constructor(
    private pathFindingService: PathFindingService,
    private gridService: GridService,
    private choreograhperService: ChoreographerService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.gridService.onPlayerAndLooPlaced.subscribe(
      (sourceAndDestination: SourceAndDestination) => {
        this.playerType = PLAYER_TYPES.SLEEPING;

        this.playerGridPos.x = sourceAndDestination.source.x;
        this.playerGridPos.y = sourceAndDestination.source.y;

        console.log("Grid Position: ", this.playerGridPos);
        this.setPlayerPosition();

        this.path = this.pathFindingService.findPath(
          sourceAndDestination.source,
          sourceAndDestination.destination
        );

        this.animatePlayer();
      }
    );

    this.choreograhperService.onMeasurementsChange.subscribe(
      (measurements: Measurements) => {
        this.measurements = measurements;
        console.log("Measurements: ", this.measurements);
        this.setPlayerPosition();
        this.animatePlayer();
      }
    );
  }

  animatePlayer() {
    if (
      !this.animatedOnce &&
      (!this.path || !this.measurements || !this.playerGridPos)
    ) {
      return;
    }

    const tl = new TimelineMax();

    this.path.forEach(node => {
      let targetPos = this.calculatePixelPosition({
        x: node.x,
        y: node.y
      });

      tl.to(this.playerRef.nativeElement, 0.5, {
        left: targetPos.y,
        top: targetPos.x
      });

      tl.play();
    });

    this.animatedOnce = true;
  }

  setPlayerPosition() {
    if (!this.measurements || !this.playerGridPos) {
      return;
    }

    this.playerPixelPos = this.calculatePixelPosition(this.playerGridPos);
  }

  calculatePixelPosition(targetPos: Vector): Vector {
    console.log(this.measurements);

    const x =
      this.measurements.gridContainerPadding +
      this.measurements.cellMargin * targetPos.x +
      this.measurements.cellSize * targetPos.x;

    const y =
      this.measurements.gridContainerPadding +
      this.measurements.cellMargin * targetPos.y +
      this.measurements.cellSize * targetPos.y;

    console.log("Calculated Pixel Pos: ", x, y);

    return { x, y };
  }
}
