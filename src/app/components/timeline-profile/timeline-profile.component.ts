import { Component, OnInit, TemplateRef } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { ActivatedRoute, Router,NavigationExtras } from '@angular/router';
import { ImageCroppedEvent , base64ToFile } from 'ngx-image-cropper';
import { ToastService } from '../../services/toast.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-timeline-profile',
  templateUrl: './timeline-profile.component.html',
  styleUrls: ['./timeline-profile.component.css']
})
export class TimelineProfileComponent implements OnInit {

userData:any;
profilePic:any;
personalInfo:any;
Occupation:any;
storage = window.localStorage;

  constructor(private http: ApiService,
    private modalService: BsModalService,
    public router: Router,
     public toast:ToastService) { }

  ngOnInit(): void {
    this.userData = JSON.parse(this.storage.getItem('userData') || '{}');
    this.profilePic = this.userData.ProfileImage;

    this.http.get('/ProfileDetail/'+this.userData.Email).subscribe(
      (res: any) => {
        if(res.status==true) {
          this.personalInfo = res.data.PersonalInfo;
        }else{          }
      },
      (error: any) => {
      }
    );
  }

  editProfile(){
    this.router.navigate(['/edit-profile/'+this.userData.Email]);
  }
}
