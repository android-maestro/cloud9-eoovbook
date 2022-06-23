import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiService } from 'src/app/services/api.service';
import { PusherServiceProvider } from 'src/app/services/pusher.service';
import { ToastService } from 'src/app/services/toast.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { EditPostComponent } from '../edit-post/edit-post.component';
import { ViewPostComponent } from '../view-post/view-post.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  trending:any;
  friends:any;
  channel:any;
  checked:boolean = false;
  Suggestedfriends:any;
  added:number = 0;
  totalcount:number=0;
  videoCount:number=0;
  imageCount:number=0;
  clicked:boolean= false;
  emails:any;
  data:any;
  btnVal = "Button";
  InvitationId:any;
  items:any;
  selectedPostStatus:any;
emailValidation:string='null';
  storage = window.localStorage;
  IsVisible: boolean=false;
  defaultOption:string = 'c024b513-2a89-47a4-a154-d53b42e015d7';
  public imagePath;
  imgURL: any;
  vdoURL:any;
  public videoPath;
  ImageFiles: any;
  VideoFile:any;
  Description:any;
  profilePic:string[] = [];
  userData:any;
  UserName:any;
  postDescription:any;
  postImages:string[] = [];
  postVideos:string[] = [];
  postComments:any;
  postCounts:any;
  PostImageName:File[]=[];
  ImageFiles1: File[] = [];
  file : File[]=[];
  isLoading:boolean=false;
  userPosts:any;
  AllPosts:any;
  UserEmail:any;
  PostId:any;
  message: string = '';
  itemsPerSlide = 4;
  singleSlideOffset = true;
  likeCount= 0;
  isLiked = false;
  modalRef?: BsModalRef;
  postError:boolean=false;
  AllCounts:any;
  TotalCounts:any;
  toggled: boolean = false;
  offsets = 2;
  noWrap = true;
  baseUrl: string;
  text:  string  =  '';

  likeform: FormGroup = new FormGroup({}); 
 postCommentform: FormGroup = new FormGroup({});
 form: FormGroup = new FormGroup({});  
 postform: FormGroup = new FormGroup({});

 
 notEmptyPost = true;
 notscrolly = true;
 post:any ;


  constructor(
    private pusher:PusherServiceProvider,
    private spinner: NgxSpinnerService,
    private fb: FormBuilder,private http: ApiService,public router: Router,
    private route: ActivatedRoute,public toast:ToastService,
    private modalService: BsModalService,  private modalser:NgbModal) {
    this.channel = this.pusher.init();

    this.baseUrl = window.location.origin;

    this.postform = this.fb.group({
      Description: ['', Validators.required],
      VideoFile: ['', Validators.required],
      ImageFiles: ['', Validators.required],
      PostStatus: ['', Validators.required],
      LoginId: ['', Validators.required]
      
      });
      

      this.postCommentform = this.fb.group({
        PostId: ['', Validators.required ],
        LoginId: ['', Validators.required],
        Description: ['', Validators.required]
        });


     }


  selectChangeHandler (event: any) {
    this.selectedPostStatus = event.target.value;
    console.warn(this.selectedPostStatus);
  }
 
 
sendRequest(email){
  console.log(email);
   var userData = JSON.parse(this.storage.getItem('userData') || '{}');
  this.channel.trigger("client-friend-request", {"name":userData.Name,"to_id":email});
  }
   
  
  changeStatus(index) {
  this.items = this.items.map((item, itemIndex) => {
  if(index === itemIndex) {
  item.active = 'active';
  } else {
  item.active = '';
  }
  return item;
  })
  }

  ngOnInit(): void {
    var userData = JSON.parse(this.storage.getItem('userData') || '{}');
    this.UserEmail = userData.Email;
    this.defaultOption = 'c024b513-2a89-47a4-a154-d53b42e015d7';

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

      

      this.loadInitPost();

      // this.post =  setInterval(() => {
      //   this.loadInitPost(); 
      // }, 30000);
      

      this.http.get('/AllPostStatus/').subscribe(
        (res: any) => {
          if(res.status==true) {
          	this.items = res.data;
            
          }else{          }
        },
        (error: any) => {
        }
      );
      var userData = JSON.parse(this.storage.getItem('userData') || '{}');
    
      this.profilePic = userData.ProfileImage;
      this.UserName = userData.Name;

      this.http.get('/GetLoggedInUserPosts/'+userData.Email+'/100/0').subscribe(
        (res: any) => {
          if(res.status==true) {
            this.userPosts = res.data;
          }else{          }
        },
        (error: any) => {
        }
      );
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

  singleNews(id){
    let navigationExtras: NavigationExtras = {
     queryParams: {
       newsId:id,
     }
   };
   this.router.navigate(['/newsdetail'], navigationExtras);
 }

 addfriend(UserId,email,index){

  var userData = JSON.parse(this.storage.getItem('userData') || '{}');
   this.http.post('/SuggestedFriendInvitation/'+UserId+'/'+userData.Email,this.form.value).subscribe(
    (res: any) => {
      if (res.status==true) {  
         this.ngOnInit();
         this.Suggestedfriends.splice(index,1);
         this.toast.success(res.message,'Request Sent Successfully');
         this.sendRequest(email);
      } else {
        console.log(res.message);
         this.clicked = false;
      }
    },
    (error: any) => {
       this.clicked = false;
    }
  );
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

ShowHide(userId){
 
     this.Suggestedfriends.splice(userId,1);
  
}


previewvideo(files) {
  if (files.length === 0)
    return;

  var mimeType = files[0].type;
  if (mimeType.match(/video\/*/) == null) {
    return;
  }

  var reader = new FileReader();
  this.videoPath = files;
  reader.readAsDataURL(files[0]); 
  reader.onload = () => { 
    this.vdoURL = reader.result; 
  }
}

ProcessVideo(e){
      let extensionAllowed = { "mp4": true, "webm": true, "mkv": true };
   
    for (let file of e.target.files) {
      if (file.size / 1024 / 1024 > 20) {
        alert("File size should be less than 20MB")
        return;
      }
      if (extensionAllowed) {
        var nam = file.name.split('.').pop();
        if (!extensionAllowed[nam]) {
          alert("Please upload " + Object.keys(extensionAllowed) + " file.")
          return;
        }
      }
      this.VideoFile = file;
    }
    console.log(this.VideoFile.size);
    
    this.videoCount = (+[Object.keys(this.VideoFile).length] + 1);
}


urls=[];
postImage(event){
  if(event.target.files){
    for(let i=0; i<=File.length+15; i++){
      var reader= new FileReader();
      reader.readAsDataURL(event.target.files[i]);
      reader.onload=(events:any)=>{
        this.urls.push(events.target.result as never);
        
      }
     this.ImageFiles= this.ImageFiles1.push(event.target.files[i]); 
     this.imageCount= this.ImageFiles;
     console.log(this.ImageFiles);
     
    }
  }
  console.log(event);
}

addPost(){
  this.isLoading= true;
  this.totalcount = this.videoCount + this.VideoFile;
   var userData = JSON.parse(this.storage.getItem('userData') || '{}');
    let model: FormData = new FormData();
    const formData = new FormData();
    for (let i = 0; i < this.ImageFiles1.length; i++) {
      model.append('ImageFiles',this.ImageFiles1[i], this.ImageFiles1[i].name);
    }
    model.append('VideoFile',this.VideoFile);
    model.append('Description',this.postform.value.Description);
    model.append('PostStatus',this.defaultOption);
    model.append('LoginId',userData.Email);
    console.log(model);
      this.http.postMultipart('/AddPost',model)
        .subscribe((res) => {
          // console.log(res);
          console.warn(this.postform.value);
          // this.router.navigate(['/index'])
          //   .then(() => {
          //     window.location.reload();
          //   });
          this.toast.success(this.message,'Post Uploaded Successfully !!');
          this.postform.reset();
          // this.ImageInput.nativeElement.value = '';
          // this.ImageFiles = '';
        
          this.urls = [];
          this.vdoURL = null;
          this.ImageFiles1 = [];
          this.VideoFile = [];
         
          this.ngOnInit();
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

          // this.router.routeReuseStrategy.shouldReuseRoute = () => false;
          // this.router.onSameUrlNavigation = 'reload';
          // this.router.navigate(['/dashboard']);
        }),(error) => {
        console.log(error);
        
        }
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
    
    this.http.get('/DashboardPostData/'+userData.Email+'/100/0').subscribe(
      (res: any) => {
        if(res.status==true) {
          this.AllPosts = res.data.userPosts;
          
        }else{          }
      },
      (error: any) => {
      }
    );
    this.postCommentform.reset();
  });
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
likeUserPost(PostId){
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
             this.AllPosts.filter(ePostCounts => ePostCounts.PostId === this.PostId)[0].ePostCounts[0].LikeCount=res.data.LikeCount;
             
            }else{          }
          },
          (error: any) => {
          }
        );
        console.log(PostId);
      }else{    

            }
    },
    (error: any) => {
    });
}
unlikeUserPost(PostId){
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
        console.log(PostId);
      }else{    

            }
    },
    (error: any) => {
    });
}

EditModal(PostId){
  this.PostId = PostId;
  
}


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

page = 10;
onScroll(){

  if (this.notscrolly && this.notEmptyPost) {
  console.log("OnScroll is runing");

  this.spinner.show(undefined,
    {
      type: 'ball-pulse-sync',
      size: 'medium',
      bdColor: 'rgba(237,242,246, 1)',
      color: '#685a9d',
      fullScreen: false
    }
  );
  this.notscrolly = false;
  setTimeout(() => {
    this.loadNextPost(this.page);
  }, 1000);  
  this.page += 2;

  }
  
}

loadNextPost(page: number){

  var userData = JSON.parse(this.storage.getItem('userData') || '{}');

  this.http.get(`/DashboardPostData/${userData.Email}/${this.offsets}/${page}`).subscribe(
    (res: any) => {
      if(res.status==true) {
        const NewAllPosts = res.data.userPosts;
        this.spinner.hide();
        this.AllPosts = this.AllPosts.concat(NewAllPosts);
        this.notscrolly = true;
      }else{          }
    },
    (error: any) => {
    }
  );

}

deletePostPublic(PostId){
  var userData = JSON.parse(this.storage.getItem('userData') || '{}');
  this.PostId = PostId;
  const i = this.AllPosts.findIndex(e => e.PostId === PostId);
       if(i !== -1){
         this.AllPosts.splice(i,1);
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
editPost(PostId){
  debugger;
  this.PostId = PostId;
  const ref = this.modalser.open(EditPostComponent);
  ref.componentInstance.SelectedPost = PostId;
  console.log(ref.componentInstance.SelectedPost);
}
viewPost(PostId){
  this.PostId = PostId;
  const ref = this.modalser.open(ViewPostComponent);
  ref.componentInstance.SelectedPost = PostId;
  console.log(ref.componentInstance.SelectedPost);
}

IsHidden= false;
 onSelectclose(){
 this.IsHidden= !this.IsHidden;
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

removeImage(i){
  this.urls.splice(i,1);
}
edited = true;
removeVideo(){
  this.edited = false;
  console.log(this.edited);
}

handleEmoji(e)  {
	this.text +=  e.char;
	console.log('Emoji Name',  e.name);
}

handleCharDelete(e)  {
	if (this.text.length >  0) {
		this.text =  this.text.substr(0,  this.text.length -  2);
	}
}

}
