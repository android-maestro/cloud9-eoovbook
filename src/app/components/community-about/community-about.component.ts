import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { ActivatedRoute, Router,NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-community-about',
  templateUrl: './community-about.component.html',
  styleUrls: ['./community-about.component.css']
})
export class CommunityAboutComponent implements OnInit {

  groupId: any;
  data: any;
  thumbnail: any;
  members: any;
  storage = window.localStorage;

  constructor(
    private http: ApiService, 
    public router: Router,
    private route: ActivatedRoute,
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
}
