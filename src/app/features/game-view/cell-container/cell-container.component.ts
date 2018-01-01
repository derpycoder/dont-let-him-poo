import { Component, HostListener, Input } from "@angular/core";

import { InteractionService, SalaryService } from "../services/";

import { TILE_TYPES, Node } from "../services/";
import { ChoreographerService } from "../services/choreographer/choreographer.service";
import { GAME_STATES } from "../services/choreographer/choreographer.model";

@Component({
  selector: "dlp-cell-container",
  templateUrl: "./cell-container.component.html",
  styleUrls: ["./cell-container.component.css"]
})
export class CellContainerComponent {
  @Input() node: Node;

  tile_types = TILE_TYPES;

  constructor(
    public interactionService: InteractionService,
    private salaryService: SalaryService,
    private choreographerService: ChoreographerService
  ) {}

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
    if (
      this.choreographerService.currentGameState !== GAME_STATES.RUNNING &&
      this.choreographerService.currentGameState !== GAME_STATES.EDIT_MODE
    ) {
      return;
    }

    if (this.node.tileType === TILE_TYPES.NONE) {
      if (
        this.interactionService.selectedTileType !== TILE_TYPES.WALL &&
        this.interactionService.selectedTileType !== TILE_TYPES.NONE
      ) {
        if (
          this.interactionService.remainingQuantity[
            this.interactionService.selectedTileType
          ] > 0
        ) {
          this.node.tileType = this.interactionService.selectedTileType;
          this.interactionService.updateQuantity(
            this.interactionService.selectedTileType
          );

          this.choreographerService.onDistractionPlaced.emit(this.node);
        }
        this.interactionService.selectedTileType = TILE_TYPES.NONE;
      } else {
        this.interactionService.selectedTileType = this.node.tileType =
          TILE_TYPES.WALL;
        this.choreographerService.onRoadBlockPlaced.emit(this.node);
      }
    } else if (this.node.tileType === TILE_TYPES.WALL) {
      if (
        this.interactionService.selectedTileType === TILE_TYPES.WALL ||
        this.interactionService.selectedTileType === TILE_TYPES.NONE
      ) {
        this.interactionService.selectedTileType = this.node.tileType =
          TILE_TYPES.NONE;

        // TODO: For updating path even when the new block placed isn't on the current path
        // This will be enabled on HARD Mode
        // this.choreographerService.onRoadBlockPlaced.emit(this.node);
      }
    }

    this.choreographerService.onTilePlaced.emit(this.node);
  }
}
