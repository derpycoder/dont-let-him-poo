import {
  Component,
  ViewChild,
  ElementRef,
  OnInit,
  OnDestroy
} from "@angular/core";
import { Subscription } from "rxjs/Subscription";

import { TimelineMax } from "gsap";

import { SalaryService } from "../../services/";

@Component({
  selector: "dlp-salary-gauge",
  templateUrl: "./salary-gauge.component.html",
  styleUrls: ["./salary-gauge.component.css"]
})
export class SalaryGaugeComponent implements OnInit, OnDestroy {
  @ViewChild("vfx") vfx: ElementRef;
  updatedSalary: string;

  isSalaryPositive: boolean;

  // Subscription
  private salarySubscription: Subscription;

  constructor(public salaryService: SalaryService) {}

  ngOnInit() {
    this.salarySubscription = this.salaryService.salaryUpdate.subscribe(
      (salary: number) => {
        this.isSalaryPositive = salary > 0;
        this.updatedSalary = this.isSalaryPositive ? "+" : "";
        this.updatedSalary += salary.toLocaleString();
        this.updateView();
      }
    );
  }

  ngOnDestroy() {
    if (this.salarySubscription) {
      this.salarySubscription.unsubscribe();
    }
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
