import { Injectable, EventEmitter, Inject, PLATFORM_ID } from "@angular/core";
import { isPlatformBrowser, isPlatformServer } from "@angular/common";
import { TILE_TYPES } from "../services/grid/grid.model";
import { InteractionService } from "./interaction.service";

@Injectable()
export class SalaryService {
  salaryUpdate: EventEmitter<number> = new EventEmitter<number>();

  private _salary: number = 0;
  set salary(value: number) {
    this._salary = value;

    this.recalculateRemainingQuantity();

    if (this._salary > this.highestSalary) {
      this.highestSalary = this._salary;
    }
  }
  get salary(): number {
    return this._salary;
  }

  private _highestSalary: number = 0;
  set highestSalary(value: number) {
    this._highestSalary = value;

    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem("highest_salary", this._highestSalary.toString());
    }
  }
  get highestSalary(): number {
    if (isPlatformBrowser(this.platformId)) {
      this._highestSalary =
        parseInt(localStorage.getItem("highest_salary"), 10) ||
        this._highestSalary;
    }

    return this._highestSalary;
  }

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private interactionService: InteractionService
  ) {}

  updateSalary(salary: number) {
    this.salary += salary;
    this.salaryUpdate.emit(salary);
  }

  recalculateSalary(tileType: string) {
    switch (tileType) {
      case TILE_TYPES.PIZZA:
        this.updateSalary(-25);
        break;
      case TILE_TYPES.MONEY:
        this.updateSalary(-75);
    }

    this.recalculateRemainingQuantity();
  }

  recalculateRemainingQuantity() {
    this.interactionService.remainingQuantity.pizza = Math.floor(
      this.salary / 25
    );
    this.interactionService.remainingQuantity.money = Math.floor(
      this.salary / 75
    );
  }

  getSalary() {
    return this.salary.toLocaleString();
  }

  getHighestSalary() {
    return this.highestSalary.toLocaleString();
  }
}
