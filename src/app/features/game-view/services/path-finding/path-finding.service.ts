import { Injectable } from "@angular/core";

import * as heap from "heap";

import { Node } from "../grid/grid.model";
import { GridService } from "../grid/grid.service";
import { HeuristicService } from "./heuristic.service";
import { InteractionService } from "../interaction.service";

@Injectable()
export class PathFindingService {
  constructor(
    private gridService: GridService,
    private heuristicService: HeuristicService,
    private interactionService: InteractionService
  ) {}

  findPath(source: Node, destination: Node) {
    //   if(this.interactionService.diagonalMovementAllowed)
    return this.aStarPathFinder(source, destination);
  }

  pathLength() {}

  private backTrack(head: Node): Node[] {
    if (!head) {
      return;
    }
    let q: Node = head;
    let path: Node[] = [];

    while (q) {
      path.push(q);
      q = q.parent;
    }
    path.splice(-1, 1);
    return path.reverse();
  }

  private aStarPathFinder(source: Node, destination: Node) {
    let openList = new heap((nodeA, nodeB) => {
      return nodeA.f - nodeB.f;
    });

    source.g = source.f = 0;

    openList.push(source);
    source.opened = true;

    while (!openList.empty()) {
      let curr: Node = openList.pop();
      curr.closed = true;

      if (curr === destination) {
        return this.backTrack(destination);
      }

      let neighbors = this.gridService.getNeighbors(curr);
      if (!neighbors) {
        continue;
      }
      neighbors.forEach((neighbor: Node) => {
        if (neighbor.closed) {
          return;
        }

        let ng = this.gridService.getCost(curr, neighbor);

        if (!neighbor.opened || ng < neighbor.g) {
          neighbor.g = ng;

          neighbor.h =
            neighbor.h || this.heuristicService.heuristic(curr, neighbor);

          neighbor.f = neighbor.g + neighbor.h;
          neighbor.parent = curr;

          if (!neighbor.opened) {
            openList.push(neighbor);
            neighbor.opened = true;
          } else {
            openList.updateItem(neighbor);
          }
        }
      });
    }
    return null;
  }

  private jpsFinder() {}
}
