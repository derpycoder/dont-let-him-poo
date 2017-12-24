import { Component } from "@angular/core";

import { environment } from "../../../environments/environment";
import { TILE_TYPES } from "./services/grid/grid.model";
import { GridService } from "./services/";

@Component({
  selector: "dlp-game-view",
  templateUrl: "./game-view.component.html",
  styleUrls: ["./game-view.component.css"]
})
export class GameViewComponent {
  title = "Don't Let Him Poo";
  tile_types = TILE_TYPES;
  env = environment;

  constructor(
    private gridService: GridService
  ) {}
}
