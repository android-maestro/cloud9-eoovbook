import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ApiService } from 'src/app/services/api.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { PusherServiceProvider } from 'src/app/services/pusher.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-community-member',
  templateUrl: './community-member.component.html',
  styleUrls: ['./community-member.component.css']
})
export class CommunityMemberComponent implements OnInit {

  storage = window.localStorage;
  userData:any;
  public imagePath;
  isLoading:boolean=false;
  validateImage:string='null';
  image:any;
  communityform: FormGroup = new FormGroup({});
  thumbnail: any;
  fileToUpload:string='';
  imageChangedEvent: any = '';
  profilePic:any;
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
  blockmember: any;
  modalRef?: BsModalRef;
  message: string = '';

  form: FormGroup = new FormGroup({});

  

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

      this.route.queryParams.subscribe(params => {
        if (params) {
          this.groupId = params['groupId'];             }
         });

        this.channel = this.pusher.init();

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
    this.profilePic = this.userData.ProfileImage;
    
    this.getCommunityId();
    
    this.CommunityMembers();

    this.communityNotification();

    this.BlockMemberlist();

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

    this.router.navigate(['/suggested-user'])
  }

  CommunityMembers(){

    this.http.get('/CommunitiesAcceptedUsers/'+this.groupId+'/100/0').subscribe(
      (res: any) => {
        if(res.status==true) {
          this.members = res.data;
        }else{          }
      },
      (error: any) => {
      }
    );

  }

  communityNotification(){

    this.http.get('/CommunitiesInProgressUsers/'+this.groupId+'/100/0').subscribe(
      (res: any) => {
        if(res.status==true) {
          this.notification = res.data;
        }else{          }
      },
      (error: any) => {
      }
    );
  }


  removeMember(InvitationId){

    this.http.get('/RemoveCommunityUser/'+InvitationId).subscribe(
      (res: any) => {
        if(res.status==true) {
          this.toast.success('Done', 'Member Removed');
          window.location.reload();
        }else{          }
      },
      (error: any) => {
      }
    );

  }

  BlockMember(invitationId){

    this.http.get('/BlockCommunityUser/'+ invitationId).subscribe(
      (res: any) => {
       if(res.status==true) {
         this.ngOnInit();
         this.toast.success('Successfully', 'Blocked User');
        //  this.router.navigate(['/community-member'])
        //        .then(() => {
        //          window.location.reload();
        //        });
              }
            },
            (error: any) => {
               this.clicked = false;
            }
          );

  }

  UnblockMember(invitationId){

    this.http.get('/UnBlockCommunityUser/'+ invitationId).subscribe(
      (res: any) => {
       if(res.status==true) {
         this.ngOnInit();
         this.toast.success('Successfully', 'UnBlocked User');
        //  this.router.navigate(['/community-member'])
        //        .then(() => {
        //          window.location.reload();
        //        });
              }
            },
            (error: any) => {
               this.clicked = false;
            }
          );

  }

  BlockMemberlist(){

    this.http.get('/CommunityUsers/'+this.groupId+'/100/0').subscribe(
      (res: any) => {
        if(res.status==true) {
          this.blockmember = res.data;
          console.log(this.blockmember[0].TotalCount);
        }else{          }
      },
      (error: any) => {
      }
    );
  }

}
