import { Injectable } from "@angular/core";

import * as heap from "heap";

import { Node } from "../grid/grid.model";
import { GridService } from "../grid/grid.service";
import { HeuristicService } from "./heuristic.service";
import { InteractionService } from "../interaction.service";
import { Vector } from "../choreographer/choreographer.model";

class Grid<T> {
  grid: T[][] = [
    [null, null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null, null]
  ];

  getCell(node: Node): T {
    if (!node) {
      return;
    }
    return this.grid[node.x][node.y];
  }
  setCell(node: Node, val: T) {
    if (!node) {
      return;
    }
    this.grid[node.x][node.y] = val;
  }
}

@Injectable()
export class PathFindingService {
  constructor(
    private gridService: GridService,
    private heuristicService: HeuristicService,
    private interactionService: InteractionService
  ) {}

  findPath(source: Node, destination: Node) {
    return this.aStarPathFinder(source, destination);
  }

  private backTrack(grid: Grid<Node>, source: Node, destination: Node): Node[] {
    const path: Node[] = [];
    let current: Node = destination;

    while (current) {
      path.push(current);
      current = grid.getCell(current);
    }

    return path.reverse();
  }

  private aStarPathFinder(source: Node, destination: Node) {
    const openList = new heap((nodeA, nodeB) => {
      return nodeA.f - nodeB.f;
    });
    const cameFrom = new Grid<Node>();
    const costSoFar = new Grid<number>();

    openList.push(source);
    cameFrom.setCell(source, null);
    costSoFar.setCell(source, 0);

    while (!openList.empty()) {
      const current: Node = openList.pop();

      if (current === destination) {
        return this.backTrack(cameFrom, source, destination);
      }

      const neighbors = this.gridService.getNeighbors(current);
      neighbors.forEach((neighbor: Node) => {
        const newCost =
          costSoFar.getCell(current) +
          this.gridService.getCost(current, neighbor);

        if (
          costSoFar.getCell(neighbor) == null ||
          newCost < costSoFar.getCell(neighbor)
        ) {
          costSoFar.setCell(neighbor, newCost);
          const priority =
            newCost + this.heuristicService.heuristic(destination, neighbor);
          openList.push(neighbor, priority);
          cameFrom.setCell(neighbor, current);
        }
      });
    }

    return [];
  }
}
