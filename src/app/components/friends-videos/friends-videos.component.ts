import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { ActivatedRoute, Router,NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-friends-videos',
  templateUrl: './friends-videos.component.html',
  styleUrls: ['./friends-videos.component.css']
})
export class FriendsVideosComponent implements OnInit {
  userData:any;
  profilePic:any;
  personalInfo:any;
  Occupation:any;
  UserId:any
  LoginId:any;
  loggedin:any;
  FriendsVideos:any;
  showFlag: boolean = false;
  selectedImageIndex: number = -1;
  currentIndex:any;
  storage = window.localStorage;

  constructor(private http: ApiService,private route: ActivatedRoute) {
    this.UserId = this.route.snapshot.params['id'];
    console.log(this.UserId);

    this.LoginId = this.route.snapshot.params['email'];
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
    this.http.get('/GetFriendVideos/'+this.UserId+'/100/0').subscribe(
      (res: any) => {
        if(res.status==true) {
          this.FriendsVideos = res.data;
        }else{          }
      },
      (error: any) => {
      }
    );
  }

  showLightbox(index) {
    this.selectedImageIndex = index;
    this.showFlag = true;
    console.log(index);
  }

  closeEventHandler() {
      this.showFlag = false;
      this.currentIndex = -1;
  }

}
