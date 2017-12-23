import { Injectable, EventEmitter } from "@angular/core";

@Injectable()
export class SalaryService {
    salaryUpdate: EventEmitter<number> = new EventEmitter<number>();

    private _salary: number = 1000;
    get salary(): string {
        return this._salary.toLocaleString();
    }

    updateSalary(salary: number) {
        this._salary += salary;
        this.salaryUpdate.emit(salary);
    }
}
