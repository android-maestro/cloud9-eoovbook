import { Component, OnInit,TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ApiService } from '../../services/api.service';
import { ActivatedRoute, Router,NavigationExtras } from '@angular/router';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-timeline-videos',
  templateUrl: './timeline-videos.component.html',
  styleUrls: ['./timeline-videos.component.css']
})
export class TimelineVideosComponent implements OnInit {
  userData:any;
  message?: string;
  public imagePath;
  userVideos:any;
  personalInfo:any;
  storage = window.localStorage;
  showFlag: boolean = false;
  selectedImageIndex: number = -1;
  currentIndex:any;
  profilePic:any;

  constructor(private http: ApiService,
    private modalService: BsModalService,public toast:ToastService,
    private route: ActivatedRoute,public router: Router) { }

  ngOnInit(): void {
    this.userData = JSON.parse(this.storage.getItem('userData') || '{}');

    this.http.get('/GetLoggedInUserVideos/'+this.userData.Email+'/100/0').subscribe(
      (res: any) => {
        if(res.status==true) {
          this.userVideos = res.data;
        }else{          }
      },
      (error: any) => {
      }
    );

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

  showLightbox(index) {
    this.selectedImageIndex = index;
    this.showFlag = true;
    console.log(index);
}

closeEventHandler() {
    this.showFlag = false;
    this.currentIndex = -1;
}
}
