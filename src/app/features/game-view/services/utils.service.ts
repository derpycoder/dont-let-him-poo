import { Injectable } from "@angular/core";

@Injectable()
export class UtilsService {
  getRandomNumber(min: number, max: number): number {
    // Inclusive of both min and max
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
