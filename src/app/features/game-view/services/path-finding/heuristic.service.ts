import { Injectable } from "@angular/core";

import { Node } from "../grid/grid.model";
import { InteractionService } from "../interaction.service";

@Injectable()
export class HeuristicService {
  constructor(private interactionService: InteractionService) {}

  heuristic(source: Node, destination: Node): number {
    let dx = Math.abs(source.x - destination.x);
    let dy = Math.abs(source.y - destination.y);
    
    let heuristic = this.interactionService.diagonalMovementAllowed
      ? this.octileDistance(dx, dy)
      : this.manhattanDistance(dx, dy);

    return heuristic * (1.0 + 10 / 100);
  }

  private manhattanDistance(dx: number, dy: number): number {
    return dx + dy + 10;
  }

  private octileDistance(dx: number, dy: number): number {
    return 10 * (dx + dy) + (14 - 2 * 10) * Math.min(dx, dy);
  }
}
