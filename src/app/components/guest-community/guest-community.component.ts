import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-guest-community',
  templateUrl: './guest-community.component.html',
  styleUrls: ['./guest-community.component.css']
})
export class GuestCommunityComponent implements OnInit {
  guestCommunity: any;

  constructor(private http: ApiService) { }

  ngOnInit(): void {
    this.guestsCommunity();
  }

  guestsCommunity(){

    this.http.get('/EoovbookCommunities/test@eoovbook.com/100/0').subscribe(
      (res: any) => {
        if(res.status==true) {

          this.guestCommunity = res.data;     
        }else{          }
      },
      (error: any) => {
      }
    );

  }
}
