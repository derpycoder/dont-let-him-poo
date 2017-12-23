import { Component, HostListener, Input } from "@angular/core";

import { InteractionService } from "../shared-services/interaction.service";

import { TILE_TYPES, CellData } from "../shared-services/";

@Component({
  selector: "dlp-cell-container",
  templateUrl: "./cell-container.component.html",
  styleUrls: ["./cell-container.component.css"]
})
export class CellContainerComponent {
  @Input() cellData: CellData;

  constructor(public interactionService: InteractionService) {}

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
    if (this.cellData.tileType === TILE_TYPES.NONE) {
      if (this.interactionService.selectedTileType !== TILE_TYPES.WALL && this.interactionService.selectedTileType !== TILE_TYPES.NONE) {
        this.cellData.tileType = this.interactionService.selectedTileType;
        this.interactionService.selectedTileType = TILE_TYPES.NONE;
      } else {
        this.interactionService.selectedTileType = this.cellData.tileType = TILE_TYPES.WALL;
      }
    } else if (this.cellData.tileType === TILE_TYPES.WALL) {
      if (this.interactionService.selectedTileType === TILE_TYPES.WALL || this.interactionService.selectedTileType === TILE_TYPES.NONE) {
        this.interactionService.selectedTileType = this.cellData.tileType = TILE_TYPES.NONE;
      }
    }
  }
}
