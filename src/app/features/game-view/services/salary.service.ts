import { Injectable } from "@angular/core";

@Injectable()
export class SalaryService {
    private _salary: number = 1000000;
    get salary(): string {
        return this._salary.toLocaleString();
    }
}
