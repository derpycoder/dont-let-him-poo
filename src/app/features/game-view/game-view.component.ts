import {
  Component,
  ViewChildren,
  QueryList,
  ElementRef,
  AfterViewInit
} from "@angular/core";

// import { TimelineMax } from 'gsap';

import { environment } from "../../../environments/environment";
import { TILE_TYPES } from "./services/grid/grid.model";
import { GridCreationService } from "./services/";

@Component({
  selector: "dlp-game-view",
  templateUrl: "./game-view.component.html",
  styleUrls: ["./game-view.component.css"]
})
export class GameViewComponent implements AfterViewInit {
  // @ViewChildren('pou') pou: QueryList<ElementRef>;

  title = "Don't Let Him Poo";
  tile_types = TILE_TYPES;
  env = environment;

  constructor(private gridCreationService: GridCreationService) {}

  ngAfterViewInit() {
    // var tl = new TimelineMax();
    // this.pou.forEach(poop => {
    //   tl.from(poop.nativeElement, 1, { y: -50, alpha: 0 });
    // });
    // tl.play();
  }
}
