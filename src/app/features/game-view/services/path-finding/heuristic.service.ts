import { Injectable } from "@angular/core";

import { Node } from "../grid/grid.model";
import { InteractionService } from "../interaction.service";

@Injectable()
export class HeuristicService {
  constructor(private interactionService: InteractionService) {}

  heuristic(source: Node, destination: Node): number {
    let dx = Math.abs(source.x - destination.x);
    let dy = Math.abs(source.y - destination.y);

    return this.interactionService.diagonalMovementAllowed
      ? this.octileDistance(dx, dy)
      : this.manhattanDistance(dx, dy);
  }

  private manhattanDistance(dx: number, dy: number): number {
    return dx + dy + 10;
  }

  private octileDistance(dx: number, dy: number): number {
    return 1 * (dx + dy) + (Math.SQRT2 - 2 * 1) * Math.min(dx, dy);
  }
}
