import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  ChangeDetectorRef
} from "@angular/core";

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

  measurements: Measurements = new Measurements();

  playerType: PLAYER_TYPES = PLAYER_TYPES.NONE;
  player_types = PLAYER_TYPES;

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

        console.log(
          this.pathFindingService.findPath(
            sourceAndDestination.source,
            sourceAndDestination.destination
          )
        );

        console.log("Grid Position: ", this.playerGridPos);
        this.setPlayerPosition();
      }
    );

    this.choreograhperService.onMeasurementsChange.subscribe(
      (measurements: Measurements) => {
        this.measurements = measurements;
        console.log("Measurements: ", this.measurements);
        this.setPlayerPosition();
      }
    );
  }

  setPlayerPosition() {
    if (!this.measurements || !this.playerGridPos) {
      return;
    }

    this.playerPixelPos.x =
      this.measurements.gridContainerPadding +
      this.measurements.cellMargin * this.playerGridPos.x +
      this.measurements.cellSize * this.playerGridPos.x;
    this.playerPixelPos.y =
      this.measurements.gridContainerPadding +
      this.measurements.cellMargin * this.playerGridPos.y +
      this.measurements.cellSize * this.playerGridPos.y;

    console.log("Calculated Pixel Pos: ", this.playerPixelPos);
  }
}
