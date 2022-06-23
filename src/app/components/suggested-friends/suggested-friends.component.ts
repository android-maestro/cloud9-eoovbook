import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { ActivatedRoute, Router,NavigationExtras } from '@angular/router';
import { FormGroup, FormControl, Validators, FormBuilder, NG_VALIDATORS, AbstractControl} from '@angular/forms';
import { ToastService } from '../../services/toast.service';
import { PusherServiceProvider } from '../../services/pusher.service';

@Component({
  selector: 'app-suggested-friends',
  templateUrl: './suggested-friends.component.html',
  styleUrls: ['./suggested-friends.component.css']
})
export class SuggestedFriendsComponent implements OnInit {
  Suggestedfriends:any;
  storage = window.localStorage;
  trending:any;
  friends:any;
  UserEmail:any;
  searchFriend;
  channel:any;
  form: FormGroup = new FormGroup({});  
  clicked:boolean= false;

  constructor(private pusher:PusherServiceProvider,private http: ApiService,public router: Router,
    private fb: FormBuilder,public toast:ToastService) {
      this.channel = this.pusher.init();
     }

  ngOnInit(): void {
    var userData = JSON.parse(this.storage.getItem('userData') || '{}');
    this.UserEmail = userData.Email;

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
  }

  sendRequest(email){
    console.log(email);
     var userData = JSON.parse(this.storage.getItem('userData') || '{}');
    this.channel.trigger("client-friend-request", {"name":userData.Name,"to_id":email});
  }

  addfriend(UserId,email){

    var userData = JSON.parse(this.storage.getItem('userData') || '{}');
     this.http.post('/SuggestedFriendInvitation/'+UserId+'/'+userData.Email,this.form.value).subscribe(
      (res: any) => {
        if (res.status==true) {  
           this.ngOnInit();
           this.toast.success(res.message,'Request Sent Successfully');
           this.sendRequest(email);
        } else {
          console.log(res.message);
           this.clicked = false;
        }
      },
      (error: any) => {
         this.clicked = false;
      }
    );
   }
   ShowHide(userId){
    this.Suggestedfriends.forEach( (item, index) => {
        if(item.UserId === userId) this.Suggestedfriends.splice(index,1);
      });
   }
}
