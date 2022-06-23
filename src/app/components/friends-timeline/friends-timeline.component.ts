import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { ActivatedRoute, Router,NavigationExtras } from '@angular/router';
import { ViewPostComponent } from '../view-post/view-post.component';
import { FormGroup, FormControl, Validators, FormBuilder, NG_VALIDATORS, AbstractControl} from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-friends-timeline',
  templateUrl: './friends-timeline.component.html',
  styleUrls: ['./friends-timeline.component.css']
})
export class FriendsTimelineComponent implements OnInit {
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

    this.http.get('/FriendsPostDetail/'+this.UserId+'/110/0').subscribe(
      (res: any) => {
        if(res.status==true) {
          this.friendsPost = res.data.userPosts;
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

  viewPost(PostId){
    this.PostId = PostId;
    const ref = this.modalSer.open(ViewPostComponent);
    ref.componentInstance.SelectedPost = PostId;
    console.log(ref.componentInstance.SelectedPost);
  }

  submitPostComment(PostId){
    this.PostId = PostId;
    var userData = JSON.parse(this.storage.getItem('userData') || '{}');
    this.postCommentform.value.PostId = this.PostId;
    this.postCommentform.value.LoginId = userData.Email;
    console.warn(this.postCommentform.value)
    this.http.post('/PostComment/',this.postCommentform.value).subscribe((data)=>{
      // this.fetchcomment();
      this.postCommentform.reset();
      this.http.get('/FriendsPostDetail/'+this.UserId+'/110/0').subscribe(
        (res: any) => {
          if(res.status==true) {
            this.friendsPost = res.data.userPosts;
          }else{          }
        },
        (error: any) => {
        }
      );
    });
  }

  copyMessage(id){
    this.toast.success(this.message,'Link Copied !!');
    let navigationExtras: NavigationExtras = {
      queryParams: {
        PostId:id,
      }
    };
    // this.router.navigate(['/newsdetail'], navigationExtras);
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = this.baseUrl+'/singlepost/'+ id;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }
  likePost(PostId){
    this.checked = true;
    this.PostId = PostId;
    var userData = JSON.parse(this.storage.getItem('userData') || '{}');
    this.likeform.value.PostId = this.PostId;
    this.likeform.value.LoginId = userData.Email;
    this.likeform.value.Mode= "1";
    
    this.http.post('/LikeUnlikeComment/',this.likeform.value).subscribe(
      (res:any)=>{
        if(res.status==true) {
          this.http.get('/PostDetailCount/'+this.PostId).subscribe(
            (res: any) => {
              if(res.status==true) {
               this.friendsPost.filter(ePostCounts => ePostCounts.PostId === this.PostId)[0].ePostCounts[0].LikeCount=res.data.LikeCount;
               
              }else{          }
            },
            (error: any) => {
            }
          );
        }else{    
  
              }
      },
      (error: any) => {
      });
  }

  unlikePost(PostId){
    this.checked = false;
    this.PostId = PostId;
    var userData = JSON.parse(this.storage.getItem('userData') || '{}');
    this.likeform.value.PostId = this.PostId;
    this.likeform.value.LoginId = userData.Email;
    this.likeform.value.Mode= "2";
    
    this.http.post('/LikeUnlikeComment/',this.likeform.value).subscribe(
      (res:any)=>{
        if(res.status==true) {
          this.http.get('/PostDetailCount/'+this.PostId).subscribe(
            (res: any) => {
              if(res.status==true) {
               this.friendsPost.filter(ePostCounts => ePostCounts.PostId === this.PostId)[0].ePostCounts[0].LikeCount=res.data.LikeCount;
               
              }else{          }
            },
            (error: any) => {
            }
          );
        }else{    
  
              }
      },
      (error: any) => {
      });
  }
}
