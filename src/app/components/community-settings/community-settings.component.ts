import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ApiService } from 'src/app/services/api.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-community-settings',
  templateUrl: './community-settings.component.html',
  styleUrls: ['./community-settings.component.css']
})
export class CommunitySettingsComponent implements OnInit {

  thumbnail: any;
  validateImage:string='null';
  image:any;
  fileToUpload:string='';
  imageChangedEvent: any = '';
  public imagePath;
  data: any;
  groupId: any;
  members: any;
  userData:any;
  profilePic:any;
  UserName:any;
  suggestCommunity: any;
  modalRef?: BsModalRef;
  message?: string;
  storage = window.localStorage;
  communityNotifications: any;
  notificationsCount:any;
  Message: any;
  friendsCount: any;
  communityCount: any;
  clicked:boolean= false;

  ActivateDeactivate: FormGroup = new FormGroup({});
  PublicPrivate; FormGroup = new FormGroup({});
 
  constructor(private http: ApiService,
    private modalService: BsModalService,
    public router: Router,
     public toast:ToastService,
     private fb: FormBuilder,
     private _route:ActivatedRoute) { 

      this._route.queryParams.subscribe(params => {
        if (params) {
          this.groupId = params['groupId'];             }
         });

         this.ActivateDeactivate = fb.group({
           privacy: ['', Validators.required]
         });

         this.PublicPrivate = fb.group({
           Ispublic: ['', Validators.required]
         });

     }
  ngOnInit(): void {
    this.userData = JSON.parse(this.storage.getItem('userData') || '{}');
    this.UserName = this.userData.Name;
    this.profilePic = this.userData.ProfileImage;

    this.getCommunityId();

    this.suggestedCommunity();
    this.communityNotification();
    this.CommunityMembers();

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
  CommunityMembers(){

    this.http.get('/CommunitiesAcceptedUsers/'+this.groupId+'/100/0').subscribe(
      (res: any) => {
        if(res.status==true) {
          this.members = res.data;
          console.log(this.members[0].TotalCount);
          if (!this.data.IsDisabled) {
            
            this.ActivateDeactivate.controls['privacy'].setValue("0");

          }else if(this.data.IsDisabled){

            this.ActivateDeactivate.controls['privacy'].setValue("1");

          }
          
          if(this.data.IsPublic){
          this.PublicPrivate.controls['Ispublic'].setValue("1");
          }
          else if(!this.data.IsPublic){

            this.PublicPrivate.controls['Ispublic'].setValue("0");

          }
          console.log(this.data.IsDisabled);
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

  deleteCommunity(){

    this.userData = JSON.parse(this.storage.getItem('userData') || '{}');

    const headers= {'GroupId': this.groupId, 'LoginId': this.userData.email};

    this.http.communitydelete('/RemoveCommunity/', headers )
    .subscribe(data => {
      this.modalRef?.hide();
      this.toast.success('Community Deleted Successfully','Great !!');
      window.location.reload();
      console.log(data);
    });
  }

  ActivateCommunity(){

    if (this.ActivateDeactivate.value.privacy == 0) {

      this.http.get('/MakeDisableEnableCommunity/'+ this.groupId + '/'+ this.ActivateDeactivate.value.privacy )
    .subscribe(data => {
     
      this.toast.success('Community Enable Successfully','Great !!');
      // window.location.reload();
      console.log(data);
    });

    }else{

      this.http.get('/MakeDisableEnableCommunity/'+ this.groupId + '/'+ this.ActivateDeactivate.value.privacy )
      .subscribe(data => {
       
        this.toast.success('Community Disable Successfully','Great !!');
        // window.location.reload();
        console.log(data);

      });
    }
    
  }

  CommunityStatus(){

    if (this.PublicPrivate.value.Ispublic == 0) {

      this.http.get('/ChangeCommunityStatus/'+ this.groupId + '/'+ this.PublicPrivate.value.Ispublic )
    .subscribe(data => {
     
      this.toast.success('Community Becomes Private','Great !!');
      // window.location.reload();
      console.log(data);
    });

    }else{

      this.http.get('/ChangeCommunityStatus/'+ this.groupId + '/'+ this.PublicPrivate.value.Ispublic )
      .subscribe(data => {
       
        this.toast.success('Community Becomes Public','Great !!');
        // window.location.reload();
        console.log(data);

      });
    }
    
  }

  communityNotification(){

    var userData = JSON.parse(this.storage.getItem('userData') || '{}');
    this.http.get('/CommunityNotifications/'+userData.Email+'/100/0').subscribe(
      (res: any) => {
        if(res.status==true) {
          this.communityCount = res.data[0].TotalCount;
          this.communityNotifications = res.data;
          this.notificationsCount += this.communityCount;
          console.log(this.notificationsCount);
        }else{          }
      },
      (error: any) => {
      }
    );
  }

  communityconfirmRequest(InvitationId){
    
    var userData = JSON.parse(this.storage.getItem('userData') || '{}');
    
    this.http.get('/AcceptCommunityRequest/'+ InvitationId).subscribe(
     (res: any) => {
       if (res.status) {  
        
          this.ngOnInit();
          this.toast.success('Done','Accepted Successfully');
          this.router.navigate(['/community'])
              .then(() => {
                window.location.reload();
              });
      
      }
     },
     (error: any) => {
        this.clicked = false;
     }
   );
  }
  
  communityRejectRequest(InvitationId){
    
    var userData = JSON.parse(this.storage.getItem('userData') || '{}');
    
    this.http.get('/RejectCommunityRequest//'+ InvitationId).subscribe(
     (res: any) => {
       if (res.status) {  
        
          this.ngOnInit();
          this.toast.success('Done','Rejected Successfully');
      
      }
     },
     (error: any) => {
        this.clicked = false;
     }
   );
  }

  getCommunityMember(){

    var encode = encodeURIComponent(this.groupId);

    let navigationExtras: NavigationExtras = {
      queryParams: {
        groupId:encode
      }
    };
    this.router.navigate(['/edit-community-member'], navigationExtras);
    // console.log("Running");
  }


}
