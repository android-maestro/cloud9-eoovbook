import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-edit-community-member',
  templateUrl: './edit-community-member.component.html',
  styleUrls: ['./edit-community-member.component.css']
})
export class EditCommunityMemberComponent implements OnInit {

  groupId: any;
  members: any;
  storage = window.localStorage;
  data: any;
  blockmember: any;

  constructor(
    public router: Router,
    private route: ActivatedRoute,
    private auth:AuthenticationService,
    private http: ApiService,
    public toast:ToastService
  ) { 

    this.route.queryParams.subscribe(params => {
      if (params) {
        this.groupId = params['groupId'];             }
       });

  }

  ngOnInit(): void {

    this.CommunityMembers();

    // this.getCommunityId();

    this.BlockMemberlist();

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

  removeMember(id){

    this.http.get('/RemoveCommunityUser/'+id).subscribe(
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
              //  this.clicked = false;
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
                      //  this.clicked = false;
                    }
                  );
        
                  }

}
