import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router,NavigationExtras } from '@angular/router';
import { AppComponent } from '../../app.component';
import { ApiService } from '../../services/api.service';
import { NumberInput } from '@angular/cdk/coercion';
import { ToastService } from '../../services/toast.service';
import { AuthenticationService } from '../../services/authentication.service';
import { PusherServiceProvider } from '../../services/pusher.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

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
  searchResults:any;
  
  allMsg:any=[];
  static getData: any;
    form: FormGroup = new FormGroup({});  
    constructor(private changeDetectorRef: ChangeDetectorRef,
      private auth:AuthenticationService,
      private pusher:PusherServiceProvider,
      private app:AppComponent,private http: ApiService,public toast:ToastService,
      public router: Router) {
      this.userData = JSON.parse(this.storage.getItem('userData') || '{}');
      this.channel = this.pusher.init();
      
      this.channel.bind('client-community-request', (data) => {
        if(data.to_id==this.userData.Email){
          // this.groupId = data.groupId;
          this.ngOnInit();
          //  this.communityNotification();
           this.toast.success(data.name +'sent you community request, Please check!','Request');
         }
       });
  
       this.channel.bind('client-community-invite', (data) => {
        if(data.to_id==this.userData.Email){
          this.ngOnInit();
          this.Message = data.message;
          //  this.communityInvitation();
           this.toast.success(data.name +'sent you community invite, Please check!','Request');
         }
       });
  
      this.channel.bind('client-friend-request', (data) => {
       if(data.to_id==this.userData.Email){
          this.ngOnInit();
          this.toast.success(data.name +'sent you friend request, Please check!','Request');
        }
      });
      this.channel.bind('client-friend-chat', (data) => {
        var msg = { profileImage:data.ProfileImage, chatMsg: data.msg, chatTime: 'Today at 2:12pm',type:2 };
  
        this.allMsg.push(msg);
       });
       }
  
    ngOnInit(): void {
      var userData = JSON.parse(this.storage.getItem('userData') || '{}');
      this.profilePic = this.userData.ProfileImage;
      this.userRole = this.userData.UserRole;
  
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
  
          this.communityNotification();
  
          // this.communityInvitation();
  
    }
  
  
    updateDetails(Pic){
    this.profilePic = Pic;
    }
  logout(){
  this.auth.logout();
  this.app.ngOnInit();
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
  chatStart(event){
    var userData = JSON.parse(this.storage.getItem('userData') || '{}');
      console.log(this.message);
      var msg = { profileImage:userData.ProfileImage, chatMsg: this.message, chatTime: 'Today at 2:12pm',type:1 };
  
      this.allMsg.push(msg);
      this.channel.trigger("client-friend-chat", {"msg":this.message});
      this.message = '';
  }
  
  communityNotification(){
  
    var userData = JSON.parse(this.storage.getItem('userData') || '{}');
    this.http.get('/CommunityNotifications/'+userData.Email+'/100/0').subscribe(
      (res: any) => {
        if(res.status==true) {

          if (res.data[0].TotalCount == undefined) {
            this.communityCount = res.data[0].TotalCount;
            console.log("It's Working");
          }else{
            this.communityCount = res.data[0].TotalCount;
          }
          
          this.communityNotifications = res.data;
          this.notificationsCount += this.communityCount;
          console.log(this.communityNotifications[0].TotalCount);
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
  
  // communityInvitation(){
  //   var userData = JSON.parse(this.storage.getItem('userData') || '{}');
    
  //   this.http.get('/AdminCommunityInvitations/'+ userData.Email+'/100/0').subscribe(
  //    (res: any) => {
  //     if(res.status==true) {
  //       this.notificationsCount = res.data.InprogressListCount;
  //       this.communityInvitations = res.data.InprogressList;
  //       console.log(this.notificationsCount)
  //     }else{          }
  //    },
  //    (error: any) => {
  //       this.clicked = false;
  //    }
  //  );
  // }
  
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
  
  search(value){
  
  console.log(value);
  
    let action_url = '/SearchEoovbook/'+value+'/100/0';
    
  
      this.http.get(action_url).subscribe(
        (res:any)=>{
          if(res.status==true){
            this.searchResults = res.data;
            let searchObj = this.searchResults;
            // this.found.emit(searchObj);
            this.router.navigate(['/search-results']);
            console.log(searchObj);
          }else{
  
          }
        },
        (error: any)=>{
  
        }
      );
  
  }
  
  getSearch(value){
  
    console.log("Header Search results: "+ value);
  
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload';
  
    let navigationExtras: NavigationExtras = {
      queryParams: {
        search:value
      }
    };
    this.router.navigate(['/search-results'], navigationExtras);
  }

  news(){

  
    this.router.navigate(['/ebnews']);
    

  }

  community(){

  
    this.router.navigate(['/community']);
    

  }

  dashboard(){

  
    this.router.navigate(['/dashboard'])
    

  }

}
