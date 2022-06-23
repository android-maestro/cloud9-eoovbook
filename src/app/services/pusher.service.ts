import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

    declare const Pusher: any;
    @Injectable()
    export class PusherServiceProvider {
      presenceChannel;
      constructor(public http: HttpClient) {
         let pusher = new Pusher('f8724adaf8fb24ddf61a', {
          encrypted: true,
          authEndpoint: 'https://www.innvoage.com/api/auth',
          cluster: 'ap2'
        });
      Pusher.logToConsole = true;
        this.channel = pusher.subscribe('private-eoovbook');
      }

 channel;

    
      public init() {
        return this.channel;
      }
    }
