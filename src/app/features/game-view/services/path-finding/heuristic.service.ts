import { Injectable } from "@angular/core";

import { Node } from "../grid/grid.model";
import { InteractionService } from "../interaction.service";
import { PLAYER_MOVES } from "../choreographer/choreographer.model";

@Injectable()
export class HeuristicService {
  constructor(private interactionService: InteractionService) {}

  heuristic(source: Node, destination: Node): number {
    const dx = Math.abs(source.x - destination.x);
    const dy = Math.abs(source.y - destination.y);

    let heuristic = this.interactionService.playerMoves === PLAYER_MOVES.DIAGONAL ||
      this.interactionService.playerMoves === PLAYER_MOVES.DIAGONAL_HOP
      ? this.octileDistance(dx, dy)
      : this.manhattanDistance(dx, dy);

      return heuristic *= (1.0 + 1 / 100);
  }

  private manhattanDistance(dx: number, dy: number): number {
    return dx + dy + 10;
  }

  private octileDistance(dx: number, dy: number): number {
    return 10 * (dx + dy) + (15 - 2 * 10) * Math.min(dx, dy);
  }
}
