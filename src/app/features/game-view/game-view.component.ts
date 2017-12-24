import {
  Component,
  ViewChild,
  ElementRef,
  HostListener,
  AfterViewInit,
  ChangeDetectorRef
} from "@angular/core";

import { environment } from "../../../environments/environment";
import { TILE_TYPES } from "./services/grid/grid.model";
import { GridService } from "./services/";
import { ChoreographerService } from "./services/choreographer/choreographer.service";

@Component({
  selector: "dlp-game-view",
  templateUrl: "./game-view.component.html",
  styleUrls: ["./game-view.component.css"]
})
export class GameViewComponent implements AfterViewInit {
  title = "Don't Let Him Poo";
  tile_types = TILE_TYPES;
  env = environment;

  @ViewChild("measuringStick") measuringStick: ElementRef;

  @HostListener("window:resize", ["$event"])
  onResize(event) {
    this.choreographerService.takeMeasurements(
      this.measuringStick.nativeElement.clientWidth
    );
  }

  constructor(
    private gridService: GridService,
    private choreographerService: ChoreographerService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngAfterViewInit() {
    setTimeout(_ =>
      this.choreographerService.takeMeasurements(
        this.measuringStick.nativeElement.clientWidth
      )
    );
  }
}
