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

  getCell(pos: Node): T {
    return this.grid[pos.x][pos.y];
  }
  setCell(pos: Node, val: T) {
    this.grid[pos.x][pos.y] = val;
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
    let path: Node[] = [];
    
    let n: Node = destination;

    while (grid.getCell(n) != null) {
      path.push(n);
      n = grid.getCell(n);
    }
    
    return path.reverse();
  }

  private aStarPathFinder(source: Node, destination: Node) {
    const openList = new heap((nodeA, nodeB) => {
      return nodeA.f - nodeB.f;
    });
    let cameFrom = new Grid<Node>();
    let costSoFar = new Grid<number>();

    openList.push(source);
    cameFrom.setCell(source, null);
    costSoFar.setCell(source, 0);

    while (!openList.empty()) {
      const current: Node = openList.pop();

      if (current == destination) {
        break;
      }

      const neighbors = this.gridService.getNeighbors(current);
      neighbors.forEach((neighbor: Node) => {
        let newCost =
          costSoFar.getCell(current) +
          this.gridService.getCost(current, neighbor);

        if (
          costSoFar.getCell(neighbor) == null ||
          newCost < costSoFar.getCell(neighbor)
        ) {
          costSoFar.setCell(neighbor, newCost);
          let priority =
            newCost + this.heuristicService.heuristic(destination, neighbor);
          openList.push(neighbor, priority);
          cameFrom.setCell(neighbor, current);
        }
      });
    }

    return this.backTrack(cameFrom, source, destination);
  }
}
