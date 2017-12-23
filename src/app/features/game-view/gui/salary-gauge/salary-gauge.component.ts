import { Component, ViewChild, ElementRef, OnInit } from "@angular/core";

import { TimelineMax } from "gsap";

import { SalaryService } from "../../services/";
import { Observable } from "rxjs/Observable";

@Component({
  selector: "dlp-salary-gauge",
  templateUrl: "./salary-gauge.component.html",
  styleUrls: ["./salary-gauge.component.css"]
})
export class SalaryGaugeComponent implements OnInit {
  @ViewChild("vfx") vfx: ElementRef;
  updatedSalary: string;

  constructor(public salaryService: SalaryService) {}

  ngOnInit() {
    this.salaryService.salaryUpdate.subscribe((salary: number) => {
      this.updatedSalary = salary.toLocaleString();
      this.updateView();
    });
  }

  updateView() {
    const tl = new TimelineMax();
    tl.set(this.vfx.nativeElement, { y: 50, alpha: 0 });

    tl
      .to(this.vfx.nativeElement, 0.5, { y: 10, alpha: 1 })
      .to(this.vfx.nativeElement, 0.5, { y: -40, alpha: 0 });

    tl.play();
  }
}
