import { Component, OnInit, Input } from "@angular/core";
import { Subscription } from "rxjs/Subscription";

@Component({
  selector: "dlp-card",
  templateUrl: "./card.component.html",
  styleUrls: ["./card.component.css"]
})
export class CardComponent implements OnInit {
  @Input() showHR: boolean;
  ngOnInit() {}
}
