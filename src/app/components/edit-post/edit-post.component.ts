import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../services/api.service';
import { FormGroup, FormControl, Validators, FormBuilder, NG_VALIDATORS, AbstractControl} from '@angular/forms';
import { ActivatedRoute, Router,NavigationExtras } from '@angular/router';
import { ToastService } from '../../services/toast.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-edit-post',
  templateUrl: './edit-post.component.html',
  styleUrls: ['./edit-post.component.css']
})
export class EditPostComponent implements OnInit {

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
  urlVideo:any;
  urlImage:any;
  totalcount:number=0;
  isLoading:boolean=false;
  public videoPath;
  modalRef?: BsModalRef;
  message?: string;
  errors:boolean=false;
  VideoName:any;
  myModal:any;
  userData:any;
  userPosts:any;
  defaultOption:string = 'c024b513-2a89-47a4-a154-d53b42e015d7';
  public isViewed = false;
  AllPosts:any;
  offsets = 2;

  storage = window.localStorage;

  selectChangeHandler (event: any) {
    this.selectedDemo = event.target.value;
    console.warn(this.selectedDemo);
  }

  postform: FormGroup = new FormGroup({});

  constructor(public modal:NgbActiveModal,
              private http: ApiService,
              private fb: FormBuilder,
              private _route:ActivatedRoute,
              public router: Router,
              public toast:ToastService) {

                this.postform = this.fb.group({
                  Description: [ '', Validators.required ],
                  VideoFile: [ this.VideoName, Validators.required ],
                  ImageFiles: [ '', Validators.required ],
                  PostStatus: [ '', Validators.required ],
                  LoginId: ['', Validators.required],
                  PostId : ['', Validators.required],
                  PostStatusId: ['', Validators.required]
                  });

               }

  ngOnInit(): void {
    var userData = JSON.parse(this.storage.getItem('userData') || '{}');
    this.UserEmail = userData.Email;
    this.profilePic = userData.ProfileImage;
    this.UserName = userData.Name;

    this._route.paramMap.subscribe(parameterMap => {
      var PostId = parameterMap.get('SelectedPost');
      // console.log(this.SelectedPost);
      this.getPost(this.SelectedPost);
    });


    this.http.get('/AllPostStatus/').subscribe(
      (res: any) => {
        if(res.status==true) {
          this.items = res.data;
          
        }else{          }
      },
      (error: any) => {
      }
    );
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
    for(let i=0; i<File.length; i++){
      var reader= new FileReader();
      reader.readAsDataURL(event.target.files[i]);
      reader.onload=(events:any)=>{
        this.urls.push(events.target.result as never);
        
      }
     this.ImageFiles= this.ImageFiles1.push(event.target.files[i]); 
     this.imageCount= this.ImageFiles;
     console.log(this.ImageFiles1);
    }
  }
  console.log(event);
}


  private getPost(SelectedPost){
    this.PostData= SelectedPost;
    console.log(this.PostData);
    var userData = JSON.parse(this.storage.getItem('userData') || '{}');
    let model: FormData = new FormData();
    const formData = new FormData();
    this.http.get('/GetPostById/'+SelectedPost).subscribe(
      (res: any) => {
        if(res.status==true) {
          this.data = res.data;
          
          let objectURL = res.data.ePostVideos;
          this.urlVideo = objectURL;
          console.log(this.urlVideo)
          
           let ImageURL = res.data.ePostImages;
          this.urlImage = ImageURL;
          console.log(this.urlImage)

          this.postform.controls['Description'].setValue(res.data.Description);
          this.postform.controls['PostStatus'].setValue(res.data.PostStatus);
          this.postform.controls['PostStatusId'].setValue(res.data.PostStatusId);
          
        }else{          }
      },
      (error: any) => {
      }
    );
  }

  modifyPost(SelectedPost){
    this.isLoading= true;
    this.PostId= SelectedPost;
    console.log(this.PostId)
    var userData = JSON.parse(this.storage.getItem('userData') || '{}');
    let model: FormData = new FormData();
    for (let i = 0; i < this.ImageFiles1.length; i++) {
      model.append('ImageFiles',this.ImageFiles1[i], this.ImageFiles1[i].name);
    }
    model.append('VideoFile',this.VideoFile);
    model.append('Description',this.postform.value.Description);
    model.append('PostStatus',this.defaultOption);
    model.append('LoginId',userData.Email);
    model.append('PostId',this.PostId);
    // model.append('PostStatusId',this.PostStatusId);
    
    console.log(model);
    this.http.postMultipart('/ModifyPost',model)
        .subscribe((res) => {
            this.toast.success('Post Updated Successfully','Great !!');
            this.isViewed = false;
            this.modal.close();
            this.http.get('/GetLoggedInUserPosts/'+this.userData.Email+'/100/0').subscribe(
              (res: any) => {
                if(res.status==true) {
                  this.userPosts = res.data;
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
                }else{          }
              },
              (error: any) => {
              }
            );
        }),(error) => {
        console.log(error);
        }
  }
  deleteImage(PostId, i){
    var userData = JSON.parse(this.storage.getItem('userData') || '{}');
    this.PostId = PostId;
    this.http.post('/RemoveImagePost/'+PostId+'/'+userData.Email,PostId)
    .subscribe(
      (res: any) => {
        if(res.status==true) {
          this.data = res.data;
            this.urlImage.splice(i,1);
            
            console.log(i);
          
        }else{          }
      },
      (error: any) => {
      }
    );
  }
  deleteVideo(PostId, index){
    var userData = JSON.parse(this.storage.getItem('userData') || '{}');
    this.PostId = PostId;
    this.http.post('/RemoveVideoPost/'+PostId+'/'+userData.Email,PostId)
    .subscribe(
      (res: any) => {
        if(res.status==true) {
          this.data = res.data;
          
            this.urlVideo.splice(index,1);
          
          
        }else{          }
      },
      (error: any) => {
      }
    );
  }
  hideEditModal() {
    this.modal.close();
  }
  
}
