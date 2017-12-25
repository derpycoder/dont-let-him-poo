import { Component, OnInit } from "@angular/core";

import { GridService } from "../services/grid/grid.service";
import { PathFindingService } from "../services/path-finding/path-finding.service";

import { ChoreographerService } from "../services/choreographer/choreographer.service";
import { GAME_STATES } from "../services/choreographer/choreographer.model";

@Component({
  selector: "dlp-grid-container",
  templateUrl: "./grid-container.component.html",
  styleUrls: ["./grid-container.component.css"]
})
export class GridContainerComponent implements OnInit {
  showGrid: boolean;
  game_states = GAME_STATES;
  
  constructor(
    public gridService: GridService,
    private pathFindingService: PathFindingService,
    public choreographerService: ChoreographerService
  ) {}

  ngOnInit() {
    if (!this.gridService.gameGrid) {
      this.gridService.initGrid();
    }
  }

  startGame() {
    this.showGrid = true;
    this.choreographerService.currentGameState = GAME_STATES.RUN;
  }
}
