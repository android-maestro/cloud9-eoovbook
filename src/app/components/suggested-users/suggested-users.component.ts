import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { PusherServiceProvider } from 'src/app/services/pusher.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-suggested-users',
  templateUrl: './suggested-users.component.html',
  styleUrls: ['./suggested-users.component.css']
})
export class SuggestedUsersComponent implements OnInit {

  storage = window.localStorage;
  suggestedUser: any;
  invitationStatus: any;
  privacy: any;
  channel:any;
  groupId: any;
  invitationId: any;
  searchUser;

  inviteForm: FormGroup = new FormGroup({});

  constructor(
    private http: ApiService,
    private pusher:PusherServiceProvider,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private toast: ToastService
  ) {

    this.channel = this.pusher.init();

    this.route.queryParams.subscribe(params => {
      if (params) {
        this.groupId = params['groupId'];             }
       });

       this.inviteForm = this.fb.group(
         {
           LoginId: [''],
           GroupId: [''],
           InviteTo: ['']
         }
       );
   }

  ngOnInit(): void {

    this.suggestedCommunityUser();

  }

  suggestedCommunityUser(){

    var userData = JSON.parse(this.storage.getItem('userData') || '{}');
    this.http.get('/GetSuggestedUsersByCommunity/'+userData.Email+'/'+ this.groupId +'/100/0').subscribe(
      (res: any) => {
        if(res.status==true) {
          
          this.suggestedUser = res.data;
          this.invitationStatus = res.data.InvitationStatus;
          console.log(this.invitationStatus);
  
        }else{          }
      },
      (error: any) => {
      }
    );

  }

  inviteCommunity(invitedUser, email){
    // if (this.privacy) {
      var userData = JSON.parse(this.storage.getItem('userData') || '{}');
      // var inviteForm: FormData = new FormData();
      this.inviteForm.value.LoginId = userData.Email;
      this.inviteForm.value.GroupId = this.groupId;
      this.inviteForm.value.InviteTo = invitedUser;
      
      console.log(invitedUser);

      this.http.post('/InviteUserFromCommunityAdmin/', this.inviteForm.value).subscribe(
        (res: any) => {
          if(res.status==true) {
            this.sendRequest(email);
            this.suggestedCommunityUser();
            this.invitationId = res.data;
            this.toast.success('Successfully', 'Invite Sent')
            console.log(this.invitationId);
          }else{          }
        },
        (error: any) => {
        }
      );
  
      
    // }
  }

  sendRequest(email){
    console.log(email);
     var userData = JSON.parse(this.storage.getItem('userData') || '{}');
    this.channel.trigger("client-community-invite", {"name":userData.Name,"to_id":email, "message":"Message3"});
  }

}
