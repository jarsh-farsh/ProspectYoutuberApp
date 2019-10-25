import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class SocialMediaData{

    getSMLinks(): string[] {
        return [
            "https://www.twitter.com",
            "https://www.youtube.com",
            "https://www.instagram.com",
            "https://www.facebook.com",
            "https://www.patreon.com",
            "https://www.paypal.com"
          ]
    }

}