import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-view-communitypost',
  templateUrl: './view-communitypost.component.html',
  styleUrls: ['./view-communitypost.component.css']
})
export class ViewCommunitypostComponent implements OnInit {

  SelectedPost: any;
  storage = window.localStorage;
  CommunityPost: any;
  pauseOnHover = true;
  pauseOnFocus = true;
  hovering :boolean=false;
  checked:boolean = false;
  likeform: FormGroup = new FormGroup({}); 
  postCommentform: FormGroup = new FormGroup({});
  PostId: any;
  UserEmail:any;
  profilePic:string[] = [];
  UserName:any;

  constructor(
    private http: ApiService,
    public modal:NgbActiveModal,
  ) { }

  ngOnInit(): void {

    var userData = JSON.parse(this.storage.getItem('userData') || '{}');
    this.UserEmail = userData.Email;
    this.profilePic = userData.ProfileImage;
    this.UserName = userData.Name;


    this.CommunityPostById();


  }

  CommunityPostById(){

    this.http.get(`/GetGroupPostById/${this.SelectedPost}`).subscribe(
      (res: any) => {
        if(res.status==true) {
          this.CommunityPost = res.data;
          
        }else{          }
      },
      (error: any) => {
      }
    );
  }

  hideEditModal() {
    this.modal.close();
  }

  LikePost(PostId){

    this.checked = true;
    var userData = JSON.parse(this.storage.getItem('userData') || '{}');
    this.likeform.value.PostId = PostId;
    this.likeform.value.LoginId = userData.Email;
    this.likeform.value.Mode= "1";
  
    this.http.post('/LikeUnlikeGroupComment/', this.likeform.value)
    .subscribe(
      (res: any) => {
        if(res.status==true) {
          // this.data = res.data;
          this.http.get(`/AllGroupPost/${this.SelectedPost}/${userData.Email}/10/0`).subscribe(
            (res: any) => {
              if(res.status==true) {
                this.CommunityPost[0].ePostCounts[0].LikeCount = res.data.LikeCount; 
                console.log(this.CommunityPost);
              }else{          }
            },
            (error: any) => {
            }
          );
          
        }else{          }
      },
      (error: any) => {
      }
    );
  
  }
  
  UnLikePost(PostId){
  
    this.checked = false;
    var userData = JSON.parse(this.storage.getItem('userData') || '{}');
    this.likeform.value.PostId = PostId;
    this.likeform.value.LoginId = userData.Email;
    this.likeform.value.Mode= "0";
  
    this.http.post('/LikeUnlikeGroupComment/', this.likeform.value)
    .subscribe(
      (res: any) => {
        if(res.status==true) {
          // this.data = res.data;
          this.http.get(`/AllGroupPost/${this.SelectedPost}/${userData.Email}/10/0`).subscribe(
            (res: any) => {
              if(res.status==true) {
                this.CommunityPost[0].ePostCounts[0].LikeCount = res.data.LikeCount; 
                console.log(this.CommunityPost);
              }else{          }
            },
            (error: any) => {
            }
          );
          
        }else{          }
      },
      (error: any) => {
      }
    );
  
  }

  submitPostComment(PostId){
    this.PostId = PostId;
    var userData = JSON.parse(this.storage.getItem('userData') || '{}');
    this.postCommentform.value.PostId = this.PostId;
    this.postCommentform.value.LoginId = userData.Email;
    console.warn(this.postCommentform.value)
    this.http.post('/PostGroupCommunityComment/',this.postCommentform.value).subscribe((data)=>{
      // this.fetchcomment();
      
      this.http.get(`/AllGroupPost/${this.SelectedPost}/${userData.Email}/10/0`).subscribe(
        (res: any) => {
          if(res.status==true) {
            this.CommunityPost = res.data.userPosts;
            
          }else{          }
        },
        (error: any) => {
        }
      );
      this.postCommentform.reset();
    });
  }
  

}
