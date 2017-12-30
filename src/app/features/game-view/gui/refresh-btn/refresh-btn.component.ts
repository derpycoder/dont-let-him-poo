import { Component, Input } from "@angular/core";

@Component({
  selector: "dlp-refresh-btn",
  templateUrl: "./refresh-btn.component.html",
  styleUrls: ["./refresh-btn.component.css"]
})
export class RefreshBtnComponent {
  @Input() isFlat: boolean;
}
