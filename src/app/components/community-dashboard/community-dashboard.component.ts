import { Component, OnInit, TemplateRef } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { AuthenticationService } from '../../services/authentication.service';
import { ActivatedRoute, Router,NavigationExtras } from '@angular/router';
import { FormGroup, FormControl, Validators, FormBuilder, NG_VALIDATORS, AbstractControl} from '@angular/forms';
import { ToastService } from '../../services/toast.service';
import { PusherServiceProvider } from '../../services/pusher.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ViewCommunitypostComponent } from '../view-communitypost/view-communitypost.component';

@Component({
  selector: 'app-community-dashboard',
  templateUrl: './community-dashboard.component.html',
  styleUrls: ['./community-dashboard.component.css']
})
export class CommunityDashboardComponent implements OnInit {

  storage = window.localStorage;
  userData:any;
  public imagePath;
  isLoading:boolean=false;
  validateImage:string='null';
  image:any;
  thumbnail: any;
  fileToUpload:string='';
  imageChangedEvent: any = '';
  profilePic:string[] = [];
  emails:any;
  friends:any;
  channel:any;
  added:number = 0;
  emailValidation:string='null';
  clicked:boolean= false;
  groupId: any;
  data: any;
  members: any;
  notification: any;
  suggestCommunity: any;
  videoCount:number=0;
  ImageFiles: any;
  ImageFiles1: File[] = [];
  VideoFile:any;
  imgURL: any;
  vdoURL:any;
  public videoPath;
  imageCount:number=0;
  totalcount:number=0;
  UserName:any;
  defaultOption:string = 'c024b513-2a89-47a4-a154-d53b42e015d7';
  selectedPostStatus:any;
  items:any;
  Description:any;
  CommunityPost: any;
  UserEmail: any;
  PostId: any;
  modalRef?: BsModalRef;
  message: string = '';
  baseUrl: any;
  checked:boolean = false;
  likeform: FormGroup = new FormGroup({}); 

  form: FormGroup = new FormGroup({});
  communitypostform: FormGroup = new FormGroup({});
  postCommentform: FormGroup = new FormGroup({});

  

  constructor( 
    private auth:AuthenticationService, 
    private pusher:PusherServiceProvider,
    private http: ApiService, 
    public router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    public toast:ToastService,
    private modalService: BsModalService, 
    private modalser:NgbModal) {

      this.communitypostform = this.fb.group({
        Description: ['', Validators.required],
        VideoFile: ['', Validators.required],
        ImageFiles: ['', Validators.required],
        PostStatus: ['', Validators.required],
        LoginId: ['', Validators.required],
        CommunityId: ['']
        
        });


        this.postCommentform = this.fb.group({
          PostId: ['', Validators.required ],
          LoginId: ['', Validators.required],
          Description: ['', Validators.required]
          });
  

        this.baseUrl = window.location.origin;
        

      this.route.queryParams.subscribe(params => {
        if (params) {
          this.groupId = params['groupId'];             }
         });


        this.channel = this.pusher.init();

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
this.form.value.loginId = userData.Email;
this.form.value.GroupId = this.groupId;
  this.form.value.emails = emailArr;
  console.log(this.groupId);
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
  
       
      

  ngOnInit(): void {
    this.userData = JSON.parse(this.storage.getItem('userData') || '{}');
    this.UserName = this.userData.Name;
    this.UserEmail = this.userData.Email;
    this.profilePic = this.userData.ProfileImage;

    this.http.get('/GetLoggedInUserPosts/'+this.userData.Email+'/100/0').subscribe(
      (res: any) => {
        if(res.status==true) {
          
        }else{          }
      },
      (error: any) => {
      }
    );

    this.defaultOption = 'c024b513-2a89-47a4-a154-d53b42e015d7';

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

    this.http.get('/DashboardData/'+userData.Email+'/10/0').subscribe(
      (res: any) => {
        if(res.status==true) {
          
          this.friends = res.data.acceptedFriends;
  
        }else{          }
      },
      (error: any) => {
      }
    );

    this.getCommunityId();

    this.suggestedCommunity();
    
    this.CommunityMembers();

    this.AllCommunityPost();

    

    // this.communityNotification();

  }


  dataURItoBlob(dataURI): Blob {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    let ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  }

  processImage(file){
    this.imageChangedEvent = file;
    var files = file.target.files;
  this.image = files.item(0);
      this.validateImage = 'null';

      var reader = new FileReader();
    this.imagePath = files;
    reader.readAsDataURL(files[0]); 
    reader.onload = (_event) => { 
      this.thumbnail = reader.result; 
    }
  }


  
  getCommunityId(){

    var userData = JSON.parse(this.storage.getItem('userData') || '{}');

    this.http.get('/GetCommunityById/'+this.groupId+'/'+userData.Email).subscribe(
      (res: any) => {
        if(res.status==true) {
         
          this.data = res.data;
          let groupImg = res.data.GroupImageName;
          this.thumbnail = groupImg;
        }else{          }
      },
      (error: any) => {
      }
    );
  }

  suggestedUserclick(){

    let navigationExtras: NavigationExtras = {
      queryParams: {
        groupId:this.groupId
      }
    };

    this.router.navigate(['/suggested-user'], navigationExtras);
  }

  CommunityMembers(){

    this.http.get('/CommunitiesAcceptedUsers/'+this.groupId+'/100/0').subscribe(
      (res: any) => {
        if(res.status==true) {
          this.members = res.data;
          console.log(this.members[0].TotalCount);
        }else{          }
      },
      (error: any) => {
      }
    );

  }


  suggestedCommunity(){

    this.http.get('/EoovbookCommunities/'+this.userData.Email+'/100/0').subscribe(
      (res: any) => {
        if(res.status==true) {
          this.suggestCommunity = res.data;
          
          console.log(this.suggestCommunity);
        }else{          }
      },
      (error: any) => {
      }
    );

  }

  
  getCommunity(){
    let navigationExtras: NavigationExtras = {
      queryParams: {
        groupId:this.groupId
      }
    };
    this.router.navigate(['/community-member'], navigationExtras);
    // console.log("Running");
  }

  getSuggestedCommunity(id){
    let navigationExtras: NavigationExtras = {
      queryParams: {
        groupId:id
      }
    };
    this.router.navigate(['/community-view-newuser'], navigationExtras);
  }


  addCommunityPost(){
    this.isLoading= true;
    this.totalcount = this.videoCount + this.VideoFile;
     var userData = JSON.parse(this.storage.getItem('userData') || '{}');
      let model: FormData = new FormData();
      const formData = new FormData();
      for (let i = 0; i < this.ImageFiles1.length; i++) {
        model.append('ImageFiles',this.ImageFiles1[i], this.ImageFiles1[i].name);
      }
      model.append('VideoFile',this.VideoFile);
      model.append('Description',this.communitypostform.value.Description);
      model.append('PostStatus',this.defaultOption);
      model.append('LoginId',userData.Email);
      model.append('CommunityId', this.groupId);
      console.log(model);
        this.http.postMultipart('/AddGroupPost',model)
          .subscribe((res) => {
            // console.log(res);
            this.isLoading = false;
            console.warn(this.communitypostform.value);
            // this.router.navigate(['/index'])
            //   .then(() => {
            //     window.location.reload();
            //   });
            this.toast.success('Done','Post Uploaded Successfully !!');
            this.communitypostform.reset();
            this.urls =[];
            this.ImageFiles1= [];
            this.ngOnInit();
            
           
          }),(error) => {
          console.log(error);
          
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


removeImage(i){
  this.urls.splice(i,1);
}
edited = true;
removeVideo(){
  this.edited = false;
  console.log(this.edited);
}

AllCommunityPost(){

  var userData = JSON.parse(this.storage.getItem('userData') || '{}');

  this.http.get(`/AllGroupPost/${this.groupId}/${userData.Email}/10/0`).subscribe(
    (res: any) => {
      if(res.status==true) {
        this.CommunityPost = res.data.userPosts; 
        console.log(this.CommunityPost);
      }else{          }
    },
    (error: any) => {
    }
  );
}

deletePostPublic(PostId){
  var userData = JSON.parse(this.storage.getItem('userData') || '{}');
  this.PostId = PostId;
  const i = this.CommunityPost.findIndex(e => e.PostId === PostId);
       if(i !== -1){
         this.CommunityPost.splice(i,1);
       }
       this.modalRef?.hide();
  this.http.post('/RemoveGroupPost/'+this.PostId+'/'+userData.Email,PostId)
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

getCommunitysetting(){
  let navigationExtras: NavigationExtras = {
    queryParams: {
      groupId:this.groupId
    }
  };
  this.router.navigate(['/community-settings'], navigationExtras);
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
        this.http.get(`/AllGroupPost/${this.groupId}/${userData.Email}/10/0`).subscribe(
          (res: any) => {
            if(res.status==true) {
              this.CommunityPost.filter(ePostCounts => ePostCounts.PostId === this.PostId)[0].ePostCounts[0].LikeCount = res.data.LikeCount; 
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
        this.http.get(`/AllGroupPost/${this.groupId}/${userData.Email}/10/0`).subscribe(
          (res: any) => {
            if(res.status==true) {
              this.CommunityPost.filter(ePostCounts => ePostCounts.PostId === this.PostId)[0].ePostCounts[0].LikeCount = res.data.LikeCount; 
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
    
    this.http.get(`/AllGroupPost/${this.groupId}/${userData.Email}/10/0`).subscribe(
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

viewPost(PostId){

  this.PostId = PostId;
  const ref = this.modalser.open(ViewCommunitypostComponent);
  ref.componentInstance.SelectedPost = PostId;
  console.log(ref.componentInstance.SelectedPost);

}


}
