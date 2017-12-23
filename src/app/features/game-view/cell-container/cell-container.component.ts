import { Component, HostListener, Input } from "@angular/core";

import { GridService } from "../shared-services/grid/grid.service";

@Component({
  selector: "dlp-cell-container",
  templateUrl: "./cell-container.component.html",
  styleUrls: ["./cell-container.component.css"]
})
export class CellContainerComponent {
  @Input() tileType: string;

  constructor(public gridService: GridService) {}

  @HostListener("mousedown")
  onMouseDown() {
    this.onPointerDown();
  }
  @HostListener("touchstart")
  onTouchStart() {
    this.onPointerDown();
    event.preventDefault();
  }

  private onPointerDown() {
    // if (this.cellData.tileType === TILE_TYPES.NONE) {
    //   if (this.gridService.selectedTileType !== TILE_TYPES.WALL && this.gridService.selectedTileType !== TILE_TYPES.NONE) {
    //     this.cellData.tileType = this.gridService.selectedTileType;
    //     this.gridService.selectedTileType = TILE_TYPES.NONE;
    //   } else {
    //     this.gridService.selectedTileType = this.cellData.tileType = TILE_TYPES.WALL;
    //   }
    // } else if (this.cellData.tileType === TILE_TYPES.WALL) {
    //   if (this.gridService.selectedTileType === TILE_TYPES.WALL || this.gridService.selectedTileType === TILE_TYPES.NONE) {
    //     this.gridService.selectedTileType = this.cellData.tileType = TILE_TYPES.NONE;
    //   }
    // }
  }
}
