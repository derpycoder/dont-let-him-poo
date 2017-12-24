import { Component, OnInit } from "@angular/core";

import { GridService } from "../services/grid/grid.service";
import { PathFindingService } from "../services/path-finding/path-finding.service";

@Component({
  selector: "dlp-grid-container",
  templateUrl: "./grid-container.component.html",
  styleUrls: ["./grid-container.component.css"]
})
export class GridContainerComponent implements OnInit {
  constructor(
    public gridService: GridService,
    private pathFindingService: PathFindingService
  ) {}

  ngOnInit() {
    if (!this.gridService.gameGrid) {
      this.gridService.initGrid();
    }
  }
}
