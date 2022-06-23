import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router,NavigationExtras } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-community-navbar',
  templateUrl: './community-navbar.component.html',
  styleUrls: ['./community-navbar.component.css']
})
export class CommunityNavbarComponent implements OnInit {

  thumbnail: any;
  data: any;
  groupId: any;
  storage = window.localStorage;
  members: any;

  constructor(
    public router: Router,
    private route: ActivatedRoute,
    private auth:AuthenticationService,
    private http: ApiService,
  ) {

    this.route.queryParams.subscribe(params => {
      if (params) {
        this.groupId = params['groupId'];             }
       });

   }

  ngOnInit(): void {

    this.getCommunityId();

    this.CommunityMembers();

  }

  getCommunityId(){

    var userData = JSON.parse(this.storage.getItem('userData') || '{}');

    this.http.get('/GetCommunityById/'+this.groupId+'/'+userData.Email).subscribe(
      (res: any) => {
        if(res.status==true) {
          this.data = res.data;
          let groupImg = res.data.GroupImageName;
          this.thumbnail = groupImg;
        }else{          }
      },
      (error: any) => {
      }
    );
  }

  CommunityMembers(){

    this.http.get('/CommunitiesAcceptedUsers/'+this.groupId+'/100/0').subscribe(
      (res: any) => {
        if(res.status==true) {
          this.members = res.data;
          console.log(this.members[0].TotalCount);
        }else{          }
      },
      (error: any) => {
      }
    );

  }

  getCommunity(){
    let navigationExtras: NavigationExtras = {
      queryParams: {
        groupId:this.groupId
      }
    };
    this.router.navigate(['/community-member'], navigationExtras);
    // console.log("Running");
  }

  aboutCommunity(){
    let navigationExtras: NavigationExtras = {
      queryParams: {
        groupId:this.groupId
      }
    };
    this.router.navigate(['/community-about'], navigationExtras);
    // console.log("Running");
  }

  getCommunitysetting(){
    let navigationExtras: NavigationExtras = {
      queryParams: {
        groupId:this.groupId
      }
    };
    this.router.navigate(['/community-settings'], navigationExtras);
  }
  

}
