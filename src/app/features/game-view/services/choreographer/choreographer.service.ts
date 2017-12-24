import { Injectable, EventEmitter } from "@angular/core";

import { Measurements, BREAKPOINTS } from "./choreographer.model";

@Injectable()
export class ChoreographerService {
  private _crucialMeasurements: Measurements;

  onMeasurementsChange: EventEmitter<Measurements> = new EventEmitter<
    Measurements
  >();

  takeMeasurements(token: number) {
    switch (token) {
      case BREAKPOINTS.DESKTOP:
        this._crucialMeasurements = {
          cellSize: 37,
          cellMargin: 4,
          gridContainerPadding: 20
        };
        break;
      case BREAKPOINTS.MOBILE:
        this._crucialMeasurements = {
          cellSize: 24,
          cellMargin: 2,
          gridContainerPadding: 9
        };
        break;
    }

    this.onMeasurementsChange.emit(this._crucialMeasurements);
  }
}
