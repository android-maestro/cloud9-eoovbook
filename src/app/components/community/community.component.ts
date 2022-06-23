import { Component, OnInit, TemplateRef } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { ActivatedRoute, Router,NavigationExtras } from '@angular/router';
import { ToastService } from '../../services/toast.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PusherServiceProvider } from '../../services/pusher.service';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-community',
  templateUrl: './community.component.html',
  styleUrls: ['./community.component.css']
})
export class CommunityComponent implements OnInit {

  userData:any;
  profilePic:any;
  allCommunity:any;
  storage = window.localStorage;
  modalRef?: BsModalRef;
  message?: string;
  param: any ;
  suggestCommunity:any;
  privacy: any;
  channel:any;
  invitationStatus: any;
  baseUrl: string;
  JoinCommunity: any;
  JoinCommunityCount: number = 0;
  allCommunityLength: number = 0;

  constructor(private http: ApiService,
    public router: Router,
    private pusher:PusherServiceProvider,
     public toast:ToastService,
     private route: ActivatedRoute,
     private fb: FormBuilder,
     private modalService: BsModalService, 
     private modalser:NgbModal) {

      this.channel = this.pusher.init();
      this.baseUrl = window.location.origin;
      
      }

  ngOnInit(): void {
    this.userData = JSON.parse(this.storage.getItem('userData') || '{}');
    this.profilePic = this.userData.ProfileImage;

    this.http.get('/GetAllCommunity/'+this.userData.Email).subscribe(
      (res: any) => {
        if(res.status==true) {
          this.allCommunity = res.data;
          this.allCommunityLength = Object.keys(this.allCommunity).length;
          console.log(this.allCommunity);
        }else{          }
      },
      (error: any) => {
      }
    );

    this.suggestedCommunity();

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

  deleteCommunity(CommunityId){

    this.userData = JSON.parse(this.storage.getItem('userData') || '{}');

    const headers= {'GroupId': CommunityId, 'LoginId': this.userData.email};

    this.http.communitydelete('/RemoveCommunity/', headers )
    .subscribe(data => {
      this.modalRef?.hide();
      this.toast.success('Community Deleted Successfully','Great !!');
      window.location.reload();
      console.log(data);
    });
  }

  suggestedCommunity(){

    this.http.get('/EoovbookCommunities/'+this.userData.Email+'/100/0').subscribe(
      (res: any) => {
        if(res.status==true) {

          this.suggestCommunity = res.data;

          var joinCommunityjson = new Array();

          for (let i = 0; i < Object.keys(this.suggestCommunity).length; i++){

            if (this.suggestCommunity[i].InvitationStatus == 'Accepted') {

              joinCommunityjson.push(this.suggestCommunity[i]);
              
            }

          }

          this.JoinCommunity = joinCommunityjson;

          this.JoinCommunityCount = Object.keys(this.JoinCommunity).length;
          
          console.log(joinCommunityjson);
          console.log(this.JoinCommunityCount);
        }else{          }
      },
      (error: any) => {
      }
    );

  }

  joinCommunity(id, email, privacy){

    console.log(privacy);

    if (privacy == true) {

      this.http.get('/JoinCommunityRequest/'+this.userData.Email+'/'+id).subscribe(
        (res: any) => {
          if(res.status==true) {
            this.sendRequest(email, "Message1");
            this.suggestedCommunity();
            this.toast.success('Done','You Joined Community Successfully');
            console.log(this.suggestCommunity);
          }else{          }
        },
        (error: any) => {
        }
      );
    }else{
      this.http.get('/JoinCommunityRequest/'+this.userData.Email+'/'+id).subscribe(
        (res: any) => {
          if(res.status==true) {
            this.sendRequest(email, "Message2");
            this.suggestedCommunity();
            this.toast.success('Done','Request sent to Admin Successfully');
            console.log(this.suggestCommunity);
          }else{          }
        },
        (error: any) => {
        }
      );
    }
  }

  sendRequest(emails, message){
    console.log(emails);
     var userData = JSON.parse(this.storage.getItem('userData') || '{}');
    this.channel.trigger("client-community-request", {"name":userData.Name,"to_id":emails, "message":message});
  }

  editcommunity(id){
    this.router.navigate(['/editcommunity/'+id]).then(function(){
      window.location.reload();
    });
  }

  getCommunity(id){
    let navigationExtras: NavigationExtras = {
      queryParams: {
        groupId:id
      }
    };
    this.router.navigate(['/community-dashboard'], navigationExtras).then(function(){
      window.location.reload();
    });
  }

  getSuggestedCommunity(id){
    let navigationExtras: NavigationExtras = {
      queryParams: {
        groupId:id
      }
    };
    this.router.navigate(['/community-view-newuser'], navigationExtras).then(function(){
      window.location.reload();
    });
  }

}
