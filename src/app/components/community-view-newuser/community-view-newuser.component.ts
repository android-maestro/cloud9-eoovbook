import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-community-view-newuser',
  templateUrl: './community-view-newuser.component.html',
  styleUrls: ['./community-view-newuser.component.css']
})
export class CommunityViewNewuserComponent implements OnInit {

  groupId: any;
  data: any;
  thumbnail: any;
  members: any;
  storage = window.localStorage;
  CommunityPost: any;
  profilePic:string[] = [];
  userData: any;
  UserName: any;
  UserEmail: any;
  items: any;
  defaultOption:string = 'c024b513-2a89-47a4-a154-d53b42e015d7';
  selectedPostStatus:any;

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

    this.userData = JSON.parse(this.storage.getItem('userData') || '{}');
    this.UserName = this.userData.Name;
    this.UserEmail = this.userData.Email;
    this.profilePic = this.userData.ProfileImage;

    this.http.get('/AllPostStatus/').subscribe(
      (res: any) => {
        if(res.status==true) {
          this.items = res.data;
          
        }else{          }
      },
      (error: any) => {
      }
    );

    this.getCommunityId();

    this.CommunityMembers();

  }

  selectChangeHandler (event: any) {
    this.selectedPostStatus = event.target.value;
    console.warn(this.selectedPostStatus);
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

  AllCommunityPost(){

    var userData = JSON.parse(this.storage.getItem('userData') || '{}');
  
    this.http.get(`/AllGroupPost/${this.groupId}/${userData.Email}/10/0`).subscribe(
      (res: any) => {
        if(res.status==true) {
          this.CommunityPost = res.data.userPosts; 
          console.log(this.CommunityPost);
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

}
