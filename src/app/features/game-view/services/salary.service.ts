import { Injectable, EventEmitter } from "@angular/core";

@Injectable()
export class SalaryService {
    salaryUpdate: EventEmitter<number> = new EventEmitter<number>();

    private _salary: number = 0;
    get salary(): string {
        return this._salary.toLocaleString();
    }

    private _highestSalary: number = 0;
    get highestSalary(): string {
        return this._highestSalary.toLocaleString();
    }

    updateSalary(salary: number) {
        this._salary += salary;

        if(this._salary > this._highestSalary) {
            this._highestSalary = this._salary;
        }
        
        this.salaryUpdate.emit(salary);
    }
}
