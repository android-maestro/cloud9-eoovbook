import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { ActivatedRoute, Router,NavigationExtras } from '@angular/router';
import { ViewPostComponent } from '../view-post/view-post.component';
import { FormGroup, FormControl, Validators, FormBuilder, NG_VALIDATORS, AbstractControl} from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-friends-header',
  templateUrl: './friends-header.component.html',
  styleUrls: ['./friends-header.component.css']
})
export class FriendsHeaderComponent implements OnInit {
  userData:any;
  profilePic:any;
  personalInfo:any;
  Occupation:any;
  UserId:any;
  loggedin:any;
  PostId:any;
  friendsPost:any;
  checked:boolean = false;
  baseUrl: string;
  message: string = '';
  friendsOfFriend:any;
  LoginId:any;
  searchText:any;
  friendsOfFriendsCount:any;
  postCommentform: FormGroup = new FormGroup({});
  likeform: FormGroup = new FormGroup({});
  storage = window.localStorage;

  constructor(private http: ApiService,private route: ActivatedRoute,
    public toast:ToastService,private modalSer:NgbModal,private fb: FormBuilder) { 

      this.baseUrl = window.location.origin;

      this.UserId = this.route.snapshot.params['id'];
      console.log(this.UserId);
  
      this.LoginId = this.route.snapshot.params['Email'];
      console.log(this.LoginId);
  
      this.route.queryParams.subscribe(params => {
        if (params) {
          this.PostId = params['PostId'];
        }
      });
  
      this.postCommentform = this.fb.group({
        PostId: ['', Validators.required ],
        LoginId: ['', Validators.required],
        Description: ['', Validators.required]
        });

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
  }

}
