import { Injectable, EventEmitter } from "@angular/core";

import { Measurements } from "./choreographer.model";

@Injectable()
export class ChoreographerService {
  private _crucialMeasurements: Measurements;

  onMeasurementsChange: EventEmitter<Measurements> = new EventEmitter<
    Measurements
  >();

  takeMeasurements(token: number) {
    switch (token) {
      case 37:
        this._crucialMeasurements = {
          cellSize: 37,
          cellMargin: 4,
          gridContainerPadding: 20
        };
        break;
      case 24:
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
