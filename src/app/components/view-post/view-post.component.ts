import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../services/api.service';
import { FormGroup, FormControl, Validators, FormBuilder, NG_VALIDATORS, AbstractControl} from '@angular/forms';
import { ActivatedRoute, Router,NavigationExtras } from '@angular/router';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-view-post',
  templateUrl: './view-post.component.html',
  styleUrls: ['./view-post.component.css']
})
export class ViewPostComponent implements OnInit {
  PostId: any;
  items:any;
  selectedDemo: string = '';
  UserEmail:any;
  data:any;
  profilePic:string[] = [];
  UserName:any;
  Description:any;
  postDescription:any;
  SelectedPost: any;
  PostData:any;
  ImageFiles: any;
  ImageFiles1: File[] = [];
  imageCount:number=0;
  VideoFile:any;
  videoCount:number=0;
  vdoURL:any;
  urlImage:any;
  totalcount:number=0;
  isLoading:boolean=false;
  public videoPath;
  message?: string;
  PostDatabyID:any;
  noPause:any;
  defaultOption:string = 'c024b513-2a89-47a4-a154-d53b42e015d7';
  liked:any;
  likeCount= 0;
  isLiked = false; 
  checked:boolean = false;
  userPosts:any;
  userData:any;
  interval:boolean=true;
  pauseOnHover = true;
  pauseOnFocus = true;
  hovering :boolean=false;
  video:any;
  storage = window.localStorage;

  postCommentform: FormGroup = new FormGroup({});
  viewform: FormGroup = new FormGroup({});
  likeform: FormGroup = new FormGroup({});

  constructor(public modal:NgbActiveModal,
    private http: ApiService,
    private fb: FormBuilder,
    private _route:ActivatedRoute,
    public router: Router,
    public toast:ToastService) { 

      this.viewform = this.fb.group({
        Description: [ '', Validators.required ],
        VideoFile: [ '', Validators.required ],
        ImageFiles: [ '', Validators.required ],
        PostStatus: [ '', Validators.required ],
        LoginId: ['', Validators.required],
        PostId : ['', Validators.required]
        
        });

        this.postCommentform = this.fb.group({
          PostId: ['', Validators.required ],
          LoginId: ['', Validators.required],
          Description: ['', Validators.required]
        });
    }

  ngOnInit(): void {
    var userData = JSON.parse(this.storage.getItem('userData') || '{}');
    this.UserEmail = userData.Email;
    this.profilePic = userData.ProfileImage;
    this.UserName = userData.Name;

    

    this.http.get('/GetPostById/'+this.SelectedPost).subscribe(
      (res: any) => {
        if(res.status==true) {
          this.PostDatabyID = res.data;
          console.log(this.PostDatabyID);
        }else{          }
      },
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
          this.likeCount++;
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
          this.likeCount--;
          console.log(PostId);
        }else{    
  
              }
      },
      (error: any) => {
      });
  }

  submitPostComment(PostId){
    this.PostId = this.PostId;
    var userData = JSON.parse(this.storage.getItem('userData') || '{}');
    this.postCommentform.value.PostId = this.SelectedPost;
    this.postCommentform.value.LoginId = userData.Email;
    console.warn(this.postCommentform.value)
    this.http.post('/PostComment/',this.postCommentform.value).subscribe((data)=>{
      // this.fetchcomment();
      this.postCommentform.reset();
      this.http.get('/GetPostById/'+this.SelectedPost).subscribe(
        (res: any) => {
          if(res.status==true) {
            this.PostDatabyID = res.data;
          }else{          }
        },
        (error: any) => {
        }
      );
    });
  }

  hideEditModal() {
    this.modal.close();
  }
}
