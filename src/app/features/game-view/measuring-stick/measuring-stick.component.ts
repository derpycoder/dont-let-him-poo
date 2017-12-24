import {
  Component,
  ViewChild,
  ElementRef,
  HostListener,
  AfterViewInit
} from "@angular/core";

import { ChoreographerService } from "../services/choreographer/choreographer.service";

@Component({
  selector: "dlp-measuring-stick",
  templateUrl: "./measuring-stick.component.html",
  styleUrls: ["./measuring-stick.component.css"]
})
export class MeasuringStickComponent implements AfterViewInit {
  @ViewChild("measuringStick") measuringStick: ElementRef;

  @HostListener("window:resize", ["$event"])
  onResize(event) {
    this.choreographerService.takeMeasurements(
      this.measuringStick.nativeElement.clientWidth
    );
  }

  constructor(private choreographerService: ChoreographerService) {}

  ngAfterViewInit() {
    setTimeout($ =>
      this.choreographerService.takeMeasurements(
        this.measuringStick.nativeElement.clientWidth
      )
    );
  }
}
