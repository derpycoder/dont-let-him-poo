import { Injectable, EventEmitter } from "@angular/core";

@Injectable()
export class SalaryService {
    salaryUpdate: EventEmitter<number> = new EventEmitter<number>();

    private _salary: number = 0;
    set salary(value: number) {
        this._salary = value;

        if(this._salary > this.highestSalary) {
            this.highestSalary = this._salary;
        }
    }
    get salary(): number {
        return this._salary;
    }

    private _highestSalary: number = 0;
    set highestSalary(value: number) {
        this._highestSalary = value;
        localStorage.setItem('highest_salary', this._highestSalary.toString());
    }
    get highestSalary(): number {
        this._highestSalary = parseInt(localStorage.getItem('highest_salary')) || this._highestSalary;
        return this._highestSalary;
    }

    updateSalary(salary: number) {
        this.salary += salary;
        this.salaryUpdate.emit(salary);
    }

    getSalary() {
        return this.salary.toLocaleString();
    }

    getHighestSalary() {
        return this.highestSalary.toLocaleString();
    }
}
