import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { ActivatedRoute, Router,NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-friends-friend',
  templateUrl: './friends-friend.component.html',
  styleUrls: ['./friends-friend.component.css']
})
export class FriendsFriendComponent implements OnInit {
  userData:any;
  profilePic:any;
  personalInfo:any;
  Occupation:any;
  UserId:any;
  friendsOfFriend:any;
  loggedin:any;
  LoginId:any;
  searchText:any;
  friendsOfFriendsCount:any;
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

    

    this.http.get('/FriendProfileDetail/'+this.UserId+'/'+ this.loggedin).subscribe(
      (res: any) => {
        if(res.status==true) {
          this.personalInfo = res.data.PersonalInfo;
        }else{          }
      },
      (error: any) => {
      }
    );

    this.http.get('/FriendOfFriends/'+this.LoginId+'/100/0/string.empty').subscribe(
      (res: any) => {
        if(res.status==true) {
          this.friendsOfFriend = res.data;
          this.friendsOfFriendsCount = this.friendsOfFriend.length;
        }else{          }
      },
      (error: any) => {
      }
    );
  }

}
