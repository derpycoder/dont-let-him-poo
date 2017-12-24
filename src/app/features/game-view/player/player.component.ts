import { Component, OnInit } from "@angular/core";

import { GridService } from "../services/grid/grid.service";
import { PathFindingService } from "../services/path-finding/path-finding.service";
import { PLAYER_TYPES } from "../services/choreographer/player.model";
import { SourceAndDestination } from "../services/grid/grid.model";

// import {LayoutModule} from '@angular/cdk/layout';

@Component({
  selector: "dlp-player",
  templateUrl: "./player.component.html",
  styleUrls: ["./player.component.css"]
})
export class PlayerComponent implements OnInit {
  playerType: PLAYER_TYPES = PLAYER_TYPES.NONE;
  player_types = PLAYER_TYPES;

  constructor(private pathFindingService: PathFindingService, private gridService: GridService) {}

  ngOnInit() {
    this.gridService.onPlayerAndLooPlaced.subscribe((sourceAndDestination: SourceAndDestination) => {
      this.playerType = PLAYER_TYPES.SLEEPING;

      console.log(this.pathFindingService.findPath(sourceAndDestination.source, sourceAndDestination.destination));
    });
  }
}
