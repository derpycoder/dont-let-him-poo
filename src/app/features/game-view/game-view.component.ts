import { Component, OnInit } from "@angular/core";

import { environment } from "../../../environments/environment";
import { TILE_TYPES } from "./services/grid/grid.model";
import { GridService } from "./services/";

import { ChoreographerService } from "./services/choreographer/choreographer.service";
import { GAME_STATES } from "./services/choreographer/choreographer.model";

@Component({
  selector: "dlp-game-view",
  templateUrl: "./game-view.component.html",
  styleUrls: ["./game-view.component.css"]
})
export class GameViewComponent implements OnInit {
  title = "Don't Let Him Poo";
  tile_types = TILE_TYPES;
  game_states = GAME_STATES;
  env = environment;

  constructor(
    private gridService: GridService,
    public choreographerService: ChoreographerService
  ) {}

  ngOnInit() {
    this.choreographerService.onGameStateChange.subscribe(state => {
      switch (state) {
        case GAME_STATES.START:
          this.gridService.initGrid();
          break;
        case GAME_STATES.RUN:
          break;
        default:
      }
    });
  }
}
