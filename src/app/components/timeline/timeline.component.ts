import { Component, OnInit,TemplateRef } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { FormGroup, FormControl, Validators, FormBuilder, NG_VALIDATORS, AbstractControl} from '@angular/forms';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ActivatedRoute, Router,NavigationExtras } from '@angular/router';
import { ImageCroppedEvent , base64ToFile } from 'ngx-image-cropper';
import { ToastService } from '../../services/toast.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EditPostComponent } from '../edit-post/edit-post.component';
import { ViewPostComponent } from '../view-post/view-post.component';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.css']
})
export class TimelineComponent implements OnInit {

  userData:any;
  profilePic:any;
  trending:any;
  friends:any;
  userPosts:any;
  Suggestedfriends:any;
  PostId:any;
  message: string = '';
  liked:any;
  data:any;
  likeCount= 0;
  isLiked = false; 
  AllPosts:any;
  personalInfo:any;
  checked:boolean = false;
  baseUrl: string;
  modalRef?: BsModalRef;
  toggled: boolean = false;
  userImages:any;
  popupImages: any = '';
  PostImageName:any;
  userVideos:any;
  AboutMe :any ;
  postCommentform: FormGroup = new FormGroup({});
  likeform: FormGroup = new FormGroup({});
  storage = window.localStorage;

  constructor(private http: ApiService,
    private modalService: BsModalService,
    public router: Router,
     public toast:ToastService,
     private route: ActivatedRoute,
     private fb: FormBuilder,  private modalSer:NgbModal) { 
      this.baseUrl = window.location.origin;
      
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

    this.http.get('/GetLoggedInUserPosts/'+this.userData.Email+'/100/0').subscribe(
      (res: any) => {
        if(res.status==true) {
          this.userPosts = res.data;
        }else{          }
      },
      (error: any) => {
      }
    );

    this.http.get('/DashboardData/'+this.userData.Email+'/10/0').subscribe(
      (res: any) => {
        if(res.status==true) {
          this.trending = res.data.news;
          this.friends = res.data.acceptedFriends;
          this.Suggestedfriends = res.data.friends;
        }else{          }
      },
      (error: any) => {
      }
    );

    this.http.get('/DashboardData/'+this.userData.Email+'/100/0').subscribe(
      (res: any) => {
        if(res.status==true) {
          this.AllPosts = res.data.userPosts; 
          console.log(this.AllPosts);
        }else{          }
      },
      (error: any) => {
      }
    );

    this.http.get('/ProfileDetail/'+this.userData.Email).subscribe(
      (res: any) => {
        if(res.status==true) {
          this.personalInfo = res.data.PersonalInfo;
        }else{          }
      },
      (error: any) => {
      }
    );

    this.http.get('/GetLoggedInUserImages/'+this.userData.Email+'/100/0').subscribe(
      (res: any) => {
        if(res.status==true) {
          this.userImages = res.data;
          this.popupImages = res.data[0].PostImageName;
          console.log(this.popupImages);
        }else{          }
      },
      (error: any) => {
      }
    );

    this.http.get('/GetLoggedInUserVideos/'+this.userData.Email+'/100/0').subscribe(
      (res: any) => {
        if(res.status==true) {
          this.userVideos = res.data;
        }else{          }
      },
      (error: any) => {
      }
    );
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  deleteModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, {class: 'modal-sm'});
  }
  confirm(): void {
    this.message = 'Confirmed!';
    this.modalRef?.hide();
  }
 
  decline(): void {
    this.message = 'Declined!';
    this.modalRef?.hide();
  }

  editPost(PostId){
    this.PostId = PostId;
    const ref = this.modalSer.open(EditPostComponent);
    ref.componentInstance.SelectedPost = PostId;
    console.log(ref.componentInstance.SelectedPost);
  }
  
  viewPost(PostId){
    this.PostId = PostId;
    const ref = this.modalSer.open(ViewPostComponent);
    ref.componentInstance.SelectedPost = PostId;
    console.log(ref.componentInstance.SelectedPost);
  }
  
  deletePost(PostId){
    var userData = JSON.parse(this.storage.getItem('userData') || '{}');
    this.PostId = PostId;
    const i = this.userPosts.findIndex(e => e.PostId === PostId);
         if(i !== -1){
           this.userPosts.splice(i,1);
         }
         this.modalRef?.hide();
    this.http.post('/RemovePost/'+this.PostId+'/'+userData.Email,PostId)
    .subscribe(
      (res: any) => {
        if(res.status==true) {
          this.data = res.data;
          
        }else{          }
      },
      (error: any) => {
      }
    );
  }
  handleSelection(event) {
    console.log(event.char);
    this.message += event.char;
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
      this.http.get('/GetLoggedInUserPosts/'+this.userData.Email+'/100/0').subscribe(
        (res: any) => {
          if(res.status==true) {
            this.userPosts = res.data;
          }else{          }
        },
        (error: any) => {
        }
      );
    });
  }
  
  offsets = 2;
  loadInitPost(){
  
    var userData = JSON.parse(this.storage.getItem('userData') || '{}');
  
    this.http.get(`/DashboardPostData/${userData.Email}/${this.offsets}/0`).subscribe(
      (res: any) => {
        if(res.status==true) {
          this.AllPosts = res.data.userPosts; 
          console.log(this.AllPosts);
        }else{          }
      },
      (error: any) => {
      }
    );
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
               this.userPosts.filter(ePostCounts => ePostCounts.PostId === this.PostId)[0].ePostCounts[0].LikeCount=res.data.LikeCount;
               
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
               this.userPosts.filter(ePostCounts => ePostCounts.PostId === this.PostId)[0].ePostCounts[0].LikeCount=res.data.LikeCount;
               
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

}
