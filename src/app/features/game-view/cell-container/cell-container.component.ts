import { Component, HostListener, Input } from "@angular/core";

import { InteractionService, SalaryService } from "../services/";

import { TILE_TYPES, CellData } from "../services/";

@Component({
  selector: "dlp-cell-container",
  templateUrl: "./cell-container.component.html",
  styleUrls: ["./cell-container.component.css"]
})
export class CellContainerComponent {
  @Input() cellData: CellData;

  constructor(
    public interactionService: InteractionService,
    private salaryService: SalaryService
  ) {}

  @HostListener("mousedown")
  onMouseDown() {
    this.onPointerDown();
    this.salaryService.updateSalary(100);
  }
  @HostListener("touchstart")
  onTouchStart() {
    this.onPointerDown();
    this.salaryService.updateSalary(100);
    event.preventDefault();
  }

  private onPointerDown() {
    if (this.cellData.tileType === TILE_TYPES.NONE) {
      if (
        this.interactionService.selectedTileType !== TILE_TYPES.WALL &&
        this.interactionService.selectedTileType !== TILE_TYPES.NONE
      ) {
        if (
          this.interactionService.remainingQuantity[
            this.interactionService.selectedTileType
          ] > 0
        ) {
          this.cellData.tileType = this.interactionService.selectedTileType;
          this.interactionService.updateQuantity(
            this.interactionService.selectedTileType
          );
        }
        this.interactionService.selectedTileType = TILE_TYPES.NONE;
      } else {
        this.interactionService.selectedTileType = this.cellData.tileType =
          TILE_TYPES.WALL;
      }
    } else if (this.cellData.tileType === TILE_TYPES.WALL) {
      if (
        this.interactionService.selectedTileType === TILE_TYPES.WALL ||
        this.interactionService.selectedTileType === TILE_TYPES.NONE
      ) {
        this.interactionService.selectedTileType = this.cellData.tileType =
          TILE_TYPES.NONE;
      }
    }
  }
}
