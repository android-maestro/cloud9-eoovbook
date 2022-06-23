import { Component, OnInit, TemplateRef } from '@angular/core';
import { ToastService } from '../../services/toast.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ActivatedRoute, Router,NavigationExtras } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { FormGroup, FormControl, Validators, FormBuilder, NG_VALIDATORS, AbstractControl} from '@angular/forms';

@Component({
  selector: 'app-timeline-friends',
  templateUrl: './timeline-friends.component.html',
  styleUrls: ['./timeline-friends.component.css']
})
export class TimelineFriendsComponent implements OnInit {

userData:any;
profilePic:any;
friends:any;
friendRequests:any;
nofriend:any;
friendsCount:any;
personalInfo:any;
clicked:boolean= false;
filteredItem:any=[];
data:any;
searchText;
selectedOption: string='Sort by';
storage = window.localStorage;

form: FormGroup = new FormGroup({}); 

  constructor(private http: ApiService,
    private modalService: BsModalService,
    public router: Router,
     public toast:ToastService) { }

  ngOnInit(): void {
    this.userData = JSON.parse(this.storage.getItem('userData') || '{}');
    this.profilePic = this.userData.ProfileImage;

    this.http.get('/DashboardData/'+this.userData.Email+'/10/0').subscribe(
      (res: any) => {
        if(res.status==true) {
          this.friends = res.data.acceptedFriends;
          this.friendsCount= this.friends.length;
        }else{          }
      },
      (error: any) => {
      }
    );

    this.http.get('/SuggestedFriends/'+this.userData.Email).subscribe(
      (res: any) => {
        if(res.status==true) {
          this.friendRequests = res.data.suggestedFriends;
          this.nofriend = res.data.InprogressCount;
        }else{          }
      },
      (error: any) => {
      }
    );
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
          this.router.navigate(['/friend-request'])
              .then(() => {
                window.location.reload();
              });
       } else {
        this.toast.warning('done','Rejected Successfully');
        this.router.navigate(['/friend-request'])
              .then(() => {
                window.location.reload();
              });
       }
      }
     },
     (error: any) => {
        this.clicked = false;
     }
   );
  }

  
}
