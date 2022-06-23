import { Component, OnInit } from '@angular/core';
import {ChangeDetectorRef} from '@angular/core';
import { ApiService } from '../../services/api.service';
import { AuthenticationService } from '../../services/authentication.service';
import { ActivatedRoute, Router,NavigationExtras } from '@angular/router';
import { FormGroup, FormControl, Validators, FormBuilder, NG_VALIDATORS, AbstractControl} from '@angular/forms';
import { AppComponent } from '../../app.component';
import { ToastService } from '../../services/toast.service';
import { PusherServiceProvider } from '../../services/pusher.service';
import { NumberInput } from '@angular/cdk/coercion';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {
storage = window.localStorage;
userData:any;
filter:any;
friendRequests:any;
Accepted:any;
notificationsCount:number = 0;
channel:any;
selectedCount:NumberInput;
clicked:boolean= false;
profilePic:string='';
message:any;
trending:any;
friends:any;
userRole:any;
Suggestedfriends:any;
communityNotifications: any;
// communityInvitations: any;
groupId: any;
Message: any;
friendsCount: any;
communityCount: any;
form: FormGroup = new FormGroup({}); 

allMsg:any=[];
static getData;


  constructor(private changeDetectorRef: ChangeDetectorRef,
  	private auth:AuthenticationService,
    private pusher:PusherServiceProvider,
  	private app:AppComponent,private http: ApiService,public toast:ToastService,
    public router: Router) { 
      this.userData = JSON.parse(this.storage.getItem('userData') || '{}');
      this.channel = this.pusher.init();
    
    }

  ngOnInit(): void {
    var userData = JSON.parse(this.storage.getItem('userData') || '{}');
    this.profilePic = userData.ProfileImage;
    this.userRole = userData.UserRole;

        this.http.get('/SuggestedFriends/'+this.userData.Email).subscribe(
          (res: any) => {
            if(res.status==true) {
              this.friendRequests = res.data.suggestedFriends;
              this.friendsCount = res.data.InprogressCount;
              this.notificationsCount += this.friendsCount;
              console.warn(this.notificationsCount);
            }else{          }
          },
          (error: any) => {
          }
        );

        this.communityNotification();
  }
  confirmRequest(InvitationId,status){
  
    var userData = JSON.parse(this.storage.getItem('userData') || '{}');
    this.form.value.InvitationId = InvitationId;
    this.form.value.loginId = userData.Email;
    this.form.value.SuggestionStatus = status;
    this.http.post('/UpdateSuggestedFriends/',this.form.value).subscribe(
     (res: any) => {
       if (res.status) {  
        if(status=='Accepted'){
          this.ngOnInit();
          this.toast.success('Done','Accepted Successfully');
          this.router.navigate(['/index'])
              .then(() => {
                window.location.reload();
              });
       } else {
        this.toast.warning('done','Rejected Successfully');
       }
      }
     },
     (error: any) => {
        this.clicked = false;
     }
   );
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
  
  
  AcceptcommunityInvitation(invitationId){
    var userData = JSON.parse(this.storage.getItem('userData') || '{}');
    
    this.http.get('/AcceptAdminCommunityRequest/'+ invitationId).subscribe(
     (res: any) => {
      if(res.status==true) {
        this.ngOnInit();
        this.toast.success('Successfully', 'Invitation Accepted');
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
  
  RejectcommunityInvitation(invitationId){
    var userData = JSON.parse(this.storage.getItem('userData') || '{}');
    
    this.http.get('/RejectAdminCommunityRequest/'+ invitationId).subscribe(
     (res: any) => {
      if(res.status==true) {
        this.ngOnInit();
        this.toast.error('Successfully', 'Invitation Rejected');
        
      }
     },
     (error: any) => {
        this.clicked = false;
     }
   );
  }
}
