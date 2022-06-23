import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { ViewPostComponent } from '../view-post/view-post.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl, Validators, FormBuilder, NG_VALIDATORS, AbstractControl} from '@angular/forms';
import { ActivatedRoute, Router,NavigationExtras } from '@angular/router';
import { ToastService } from '../../services/toast.service';


@Component({
  selector: 'app-single-post',
  templateUrl: './single-post.component.html',
  styleUrls: ['./single-post.component.css']
})
export class SinglePostComponent implements OnInit {

  offsets = 2;
  AllPosts:any;
  trending:any;
  friends:any;
  Suggestedfriends:any;
  UserEmail:any;
  PostId:any;
  message: string = '';
  singlePostData:any;
  checked:boolean = false;
  baseUrl: string;
  profilePic:any;
  added:number = 0;
  emailValidation:string='null';
  userPosts:any;
  emails:any;
  clicked:boolean= false;
  storage = window.localStorage;

  form: FormGroup = new FormGroup({});  
  postCommentform: FormGroup = new FormGroup({});
  likeform: FormGroup = new FormGroup({});

  constructor(private http: ApiService,private modalser:NgbModal, private route: ActivatedRoute,
    public router: Router,public toast:ToastService) {
      this.baseUrl = window.location.origin;

      this.PostId = this.route.snapshot.params['id'];

    this.route.paramMap.subscribe(params => {
      if (params) {
        var postId = params.get('id');     
      console.log(postId);     }
       });
   }

  ngOnInit(): void {

    var userData = JSON.parse(this.storage.getItem('userData') || '{}');
    this.UserEmail = userData.Email;
    this.profilePic = userData.ProfileImage;
    

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

    this.http.get('/GetPostById/'+this.PostId).subscribe(
      (res: any) => {
        if(res.status==true) {
          this.singlePostData = res.data;
        }else{          }
      },
      (error: any) => {
      }
    );

    this.http.get('/DashboardData/'+userData.Email+'/10/0').subscribe(
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

  }

  viewPost(PostId){
    this.PostId = PostId;
    const ref = this.modalser.open(ViewPostComponent);
    ref.componentInstance.SelectedPost = PostId;
    console.log(ref.componentInstance.SelectedPost);
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
               this.singlePostData.filter(ePostCounts => ePostCounts.PostId === this.PostId)[0].ePostCounts[0].LikeCount=res.data.LikeCount;
               
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
               this.AllPosts.filter(ePostCounts => ePostCounts.PostId === this.PostId)[0].ePostCounts[0].LikeCount=res.data.LikeCount;
               
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

  submitPostComment(PostId){
    this.PostId = PostId;
    var userData = JSON.parse(this.storage.getItem('userData') || '{}');
    this.postCommentform.value.PostId = this.PostId;
    this.postCommentform.value.LoginId = userData.Email;
    console.warn(this.postCommentform.value)
    this.http.post('/PostComment/',this.postCommentform.value).subscribe((data)=>{
      // this.fetchcomment();
      this.postCommentform.reset();
      this.http.get('/GetLoggedInUserPosts/'+userData.Email+'/100/0').subscribe(
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

  onSelect(item) {
    this.added++;
    console.log(item.value);
         const EMAIL_REGEXP = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
        if (!EMAIL_REGEXP.test(item.value)) {
             this.emailValidation = 'Please enter a valid email address';
        }else{
          this.emailValidation = 'null';
        }
    }
   change(item) {
        console.log('tag selected: value is ' + this.emails);
    }

    submit(){

      this.clicked = true;
       if(this.added==0){
        this.emailValidation = 'Please enter email addresses.';
        this.clicked = false;
        return;
      }
      
        var emailArr:string[] = [];
        const EMAIL_REGEXP = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
      var error = 'null';
      this.emails.forEach(function (value,i){
  
          if (!EMAIL_REGEXP.test(value['value'])) {
               error = 'Invalid email address included,Please check.';
  
          }else{
            emailArr[i] = value['value'];
          }
        
      });
      if(error!='null'){
        this.emailValidation = error;
        this.clicked = false;
        return;
      }
      var userData = JSON.parse(this.storage.getItem('userData') || '{}');
      this.form.value.name = userData.Name;
      this.form.value.loginId = userData.Mobile;
        this.form.value.emails = emailArr;
          if(this.form.valid){
          this.http.post('/FriendInvitation',this.form.value).subscribe(
              (res: any) => {
                if (res.status==true) {  
                  this.clicked = false;
                  this.emails = '';
                  this.toast.success(res.message,'Invitation Sent');
                } else {
                  console.log(res.message);
                  this.clicked = false;
                }
              },
              (error: any) => {
                this.clicked = false;
              }
            );
        }else{
          console.log('not validated');
        }
    }

    singleNews(id){
      let navigationExtras: NavigationExtras = {
       queryParams: {
         newsId:id,
       }
     };
     this.router.navigate(['/newsdetail'], navigationExtras);
   }
}
