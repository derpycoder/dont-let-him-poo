import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";

import { GridService } from "../services/grid/grid.service";
import { PathFindingService } from "../services/path-finding/path-finding.service";

import { ChoreographerService } from "../services/choreographer/choreographer.service";
import { GAME_STATES } from "../services/choreographer/choreographer.model";

import { TimelineMax } from "gsap";
import { SalaryService } from "../services/salary.service";

@Component({
  selector: "dlp-grid-container",
  templateUrl: "./grid-container.component.html",
  styleUrls: ["./grid-container.component.css"]
})
export class GridContainerComponent implements OnInit {
  showGrid: boolean;
  game_states = GAME_STATES;

  @ViewChild("vfx") vfx: ElementRef;
  countDown: string;

  constructor(
    public gridService: GridService,
    private pathFindingService: PathFindingService,
    public choreographerService: ChoreographerService,
    public salaryService: SalaryService
  ) {}

  ngOnInit() {
    if (!this.gridService.gameGrid) {
      this.gridService.initGrid();
    }

    this.choreographerService.onGameStateChange.subscribe(state => {
      switch (state) {
        case GAME_STATES.START:
          this.showGrid = false;
          break;
        case GAME_STATES.RUN:
          this.doCountDown();
          this.showGrid = true;
          break;
        default:
      }
    });
  }

  private doCountDown() {
    const tl = new TimelineMax();

    tl
      .add($ => {
        this.countDown = "3";
      })
      .set(this.vfx.nativeElement, { scale: 2, alpha: 0 })
      .to(this.vfx.nativeElement, 0.5, { scale: 1, alpha: 1 })
      .add($ => {
        this.countDown = "2";
      })
      .set(this.vfx.nativeElement, { scale: 2, alpha: 0 })
      .to(this.vfx.nativeElement, 0.5, { scale: 1, alpha: 1 })
      .add($ => {
        this.countDown = "1";
      })
      .set(this.vfx.nativeElement, { scale: 2, alpha: 0 })
      .to(this.vfx.nativeElement, 0.5, { scale: 1, alpha: 1 })
      .add($ => {
        this.countDown = "GO";
      })
      .set(this.vfx.nativeElement, { z: 50, alpha: 0 })
      .to(this.vfx.nativeElement, 0.5, { z: 0, alpha: 1 })
      .set(this.vfx.nativeElement, { alpha: 0, scale: 0 })
      .add($ => {
        this.choreographerService.currentGameState = GAME_STATES.RUNNING;
      });

    tl.play();
  }

  startGame() {
    this.choreographerService.currentGameState = GAME_STATES.RUN;
  }
}
