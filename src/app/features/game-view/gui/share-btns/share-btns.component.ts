import { Component } from "@angular/core";
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";

import { GoogleAnalyticsService } from "../../../../shared/";

@Component({
  selector: "dlp-share-btns",
  templateUrl: "./share-btns.component.html",
  styleUrls: ["./share-btns.component.css"]
})
export class ShareBtnsComponent {
  tweetIntent: string = "https://twitter.com/intent/tweet/";

  private _whatsAppMsg: string = "whatsapp://send?text=";
  whatsAppMsg: SafeUrl;

  facebookMsg: string = "https://www.facebook.com/sharer/sharer.php?u=";
  googleMsg: string = "https://plus.google.com/share?url=";
  pinterestMsg: string = "http://pinterest.com/pin/create/button/?";
  linkedInMsg: string = "http://www.linkedin.com/shareArticle?mini=true&";

  private urlToBeShared: string = "http://www.abhijit-kar.com/dont-let-him-poo/";
  private msgToBeShared: string = "Prevent the pesky emoji from going to loo. Coz, it's a game revolving around poo!";

  constructor(
    private domSanitizer: DomSanitizer,
    private googleAnalyticsService: GoogleAnalyticsService
  ) {
    this.constructTweetIntent();

    this._whatsAppMsg += encodeURIComponent(this.urlToBeShared);
    this.whatsAppMsg = this.domSanitizer.bypassSecurityTrustUrl(
      this._whatsAppMsg
    );

    this.facebookMsg += encodeURIComponent(this.urlToBeShared);
    this.googleMsg += encodeURIComponent(this.urlToBeShared);

    this.constructPinterestMsg();
    this.constructLinkedInMsg();
  }

  directToSocialSite(event: Event, siteName: string, url: string) {
    event.preventDefault();
    this.googleAnalyticsService.emitEvent("Social", siteName, $ => {
      window.open(url, "_blank");
    });
  }

  private constructTweetIntent() {
    const attributes = {
      "?original_referer": "http://www.abhijit-kar.com",
      "&text": this.msgToBeShared,
      "&hashtags": "dontletim",
      "&url": this.urlToBeShared,
      "&via": "ak24284"
    };

    Object.keys(attributes).forEach(key => {
      this.tweetIntent += key + "=" + encodeURIComponent(attributes[key]);
    });
  }

  private constructLinkedInMsg() {
    const attributes = {
      url: this.urlToBeShared,
      "&title": "Dont Let him Poo",
      "&summary": this.msgToBeShared,
      "&source": this.urlToBeShared
    };

    Object.keys(attributes).forEach(key => {
      this.linkedInMsg += key + "=" + encodeURIComponent(attributes[key]);
    });
  }

  private constructPinterestMsg() {
    const attributes = {
      url: this.urlToBeShared,
      "&description": "Don't Let Him Poo",
      "&media":
        "http://www.abhijit-kar.com/dont-let-him-poo/assets/meta/screenshot.png"
    };

    Object.keys(attributes).forEach(key => {
      this.pinterestMsg += key + "=" + encodeURIComponent(attributes[key]);
    });
  }
}
