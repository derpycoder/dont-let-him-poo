import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef
} from "@angular/core";
import { Subscription } from "rxjs/Subscription";

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
export class GridContainerComponent implements OnInit, OnDestroy {
  showGrid: boolean;
  game_states = GAME_STATES;

  @ViewChild("vfx") vfx: ElementRef;
  countDown: string;

  private tl: TimelineMax;

  // Subscriptions
  private choreographerSubscription: Subscription;

  constructor(
    public gridService: GridService,
    private pathFindingService: PathFindingService,
    public choreographerService: ChoreographerService,
    public salaryService: SalaryService
  ) {}

  ngOnInit() {
    this.tl = new TimelineMax();

    if (this.choreographerService.currentGameState === GAME_STATES.LOAD) {
      this.gridService.initGrid();
    }

    this.choreographerSubscription = this.choreographerService.onGameStateChange.subscribe(
      state => {
        switch (state) {
          case GAME_STATES.LOAD:
            this.tl.clear();
            this.countDown = "";
            this.showGrid = false;
            this.gridService.initGrid();
            break;
          case GAME_STATES.START:
            this.showGrid = false;
            break;
          case GAME_STATES.RUN:
            this.doCountDown();
            this.showGrid = true;
            break;
          case GAME_STATES.EDIT_MODE:
            if (this.showGrid) {
              this.gridService.initGrid();
            }
            this.showGrid = true;
            break;
          default:
        }
      }
    );
  }

  ngOnDestroy() {
    if (this.choreographerSubscription) {
      this.choreographerSubscription.unsubscribe();
    }
  }

  private doCountDown() {
    this.tl = new TimelineMax();

    this.tl
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
        if (this.choreographerService.currentGameState === GAME_STATES.RUN) {
          this.choreographerService.currentGameState = GAME_STATES.RUNNING;
        }
      });

    this.tl.play();
  }

  startGame() {
    this.choreographerService.currentGameState = GAME_STATES.RUN;
  }
}
