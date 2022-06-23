import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { ActivatedRoute, Router,NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-friends-photos',
  templateUrl: './friends-photos.component.html',
  styleUrls: ['./friends-photos.component.css']
})
export class FriendsPhotosComponent implements OnInit {
  userData:any;
  profilePic:any;
  personalInfo:any;
  Occupation:any;
  UserId:any;
  loggedin:any;
  friendsImages:any;
  storage = window.localStorage;
  showFlag: boolean = false;
  selectedImageIndex: number = -1;
  currentIndex:any;

  constructor(private http: ApiService,private route: ActivatedRoute) {
    this.UserId = this.route.snapshot.params['id'];
    console.log(this.UserId);
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

    this.http.get('/GetFriendImages/'+this.UserId+'/100/0').subscribe(
      (res: any) => {
        if(res.status==true) {
          this.friendsImages = res.data;
        }else{          }
      },
      (error: any) => {
      }
    );
  }

  showLightbox(index) {
    this.selectedImageIndex = index;
    this.showFlag = true;
  }
  closeEventHandler() {
    this.showFlag = false;
    this.currentIndex = -1;
  }

}
