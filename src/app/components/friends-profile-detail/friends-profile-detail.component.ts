import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { ActivatedRoute, Router,NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-friends-profile-detail',
  templateUrl: './friends-profile-detail.component.html',
  styleUrls: ['./friends-profile-detail.component.css']
})
export class FriendsProfileDetailComponent implements OnInit {
  userData:any;
  profilePic:any;
  personalInfo:any;
  Occupation:any;
  UserId:any;
  LoginId:any;
  loggedin:any;
  storage = window.localStorage;

  constructor(private http: ApiService,private route: ActivatedRoute) { 
    this.UserId = this.route.snapshot.params['id'];
    console.log(this.UserId);

    this.LoginId = this.route.snapshot.params['Email'];
    console.log(this.LoginId);
  }

  ngOnInit(): void {
    this.userData = JSON.parse(this.storage.getItem('userData') || '{}');
    this.profilePic = this.userData.ProfileImage;
    this.loggedin = this.userData.Email;

    

    this.http.get('/FriendProfileDetail/'+this.UserId +'/'+ this.loggedin).subscribe(
      (res: any) => {
        if(res.status==true) {
          this.personalInfo = res.data.PersonalInfo;
        }else{          }
      },
      (error: any) => {
      }
    );
  }
  

}
