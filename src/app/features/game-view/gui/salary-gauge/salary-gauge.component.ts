import { Component } from "@angular/core";

import { SalaryService } from "../../services/";

@Component({
  selector: "dlp-salary-gauge",
  templateUrl: "./salary-gauge.component.html",
  styleUrls: ["./salary-gauge.component.css"]
})
export class SalaryGaugeComponent {
  constructor (public salaryService: SalaryService) {}
}
