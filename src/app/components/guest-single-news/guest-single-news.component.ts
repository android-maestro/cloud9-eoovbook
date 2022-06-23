import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, NG_VALIDATORS, AbstractControl} from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { ActivatedRoute, Router,NavigationExtras } from '@angular/router';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-guest-single-news',
  templateUrl: './guest-single-news.component.html',
  styleUrls: ['./guest-single-news.component.css']
})
export class GuestSingleNewsComponent implements OnInit {
newsId:any;
data:any;
LoginId:any;
trending:any;
userData:any;
commentnews:any;
newsCount: any;
message?: string;
likednews:boolean=false;
storage = window.localStorage;
baseUrl: string;
commentform: FormGroup = new FormGroup({});

  constructor(private fb: FormBuilder,
    private http: ApiService,
    public router: Router,
    public toast:ToastService,
    private route: ActivatedRoute) {
      this.baseUrl = window.location.origin;

      this.route.queryParams.subscribe(params => {
       if (params) {
            this.newsId = params['newsId'];          
           }
        });


        this.commentform = this.fb.group({
         NewsId: ['', Validators.required ],
         LoginId: ['', Validators.required],
         NewsComment: ['', Validators.required]
         });

     }

  ngOnInit(): void {

    this.fetchcomment();
  	var userData = JSON.parse(this.storage.getItem('userData') || '{}');
  	 	 this.http.get('/TrendingNewsLeftPanel/'+userData.email+'/10/0').subscribe(
        (res: any) => {
          if(res.status==true) {
          	this.trending = res.data;
          }else{          }
        },
        (error: any) => {
        }
      );

  	 this.http.get('/NewsDetail/'+this.newsId).subscribe(
        (res: any) => {
          if(res.status==true) {
          	this.data = res.data.Detail;
          }else{          }
        },
        (error: any) => {
        }
      );
  }

  like(){
    this.data.LikesCount++;
    var userData = JSON.parse(this.storage.getItem('userData') || '{}');
    var formData: FormData = new FormData();
    formData.append('LoginId', userData.Email);
    console.warn(userData.Email)
    this.http.post('/LikeNews/'+this.newsId+'/'+userData.Email,this.likednews).subscribe(
      (res:any)=>{
        if(res.status==true) {
          this.likednews = res.data;
        }else{          }
      },
      (error: any) => {
      });
  }

  fetchcomment(){
    this.http.get('/NewsComment/'+this.newsId).subscribe(
      (res:any)=>{
        if(res.status==true) {
          this.commentnews = res.data;
          this.newsCount = res.data.length;
        }else{          }
      },
      (error: any) => {
      });
  }

  submitcomment(){
    var userData = JSON.parse(this.storage.getItem('userData') || '{}');
    this.commentform.value.NewsId = this.newsId;
    this.commentform.value.LoginId = userData.Email;
    console.warn(this.commentform.value)
    this.http.post('/PostNewsComment/',this.commentform.value).subscribe((data)=>{
      this.fetchcomment();
    });
  }
  deleteNews(){
    var userData = JSON.parse(this.storage.getItem('userData') || '{}');
    this.http.delete('/DeleteNews/'+this.newsId+'/'+userData.Email)
    .subscribe(
      (res: any) => {
        if(res.status==true) {
          this.data = res.data;
          this.router.navigate(['/ebnews']);
        }else{          }
      },
      (error: any) => {
      }
    );
  }

  singleNews(id){
    this.http.get('/NewsDetail/'+id).subscribe(
      (res: any) => {
        if(res.status==true) {
          this.data = res.data.Detail;
        }else{          }
      },
      (error: any) => {
      }
    );
  }

  editNews(){
    this.router.navigate(['/editnews/'+this.newsId]);
  }

  copyMessage(id){
    this.toast.success(this.message,'Link Copied !!');
    let navigationExtras: NavigationExtras = {
      queryParams: {
        newsId:id,
      }
    };
    // this.router.navigate(['/newsdetail'], navigationExtras);
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = this.baseUrl+'/newsdetail?newsId='+ id;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }

  
  openFacebook(id){
    console.log(id);
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = this.baseUrl+'/newsdetail?newsId='+ id;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('paste');
    document.body.removeChild(selBox)
    window.open('https://www.facebook.com/sharer/sharer.php?u='+selBox.value); 
  }
  
}
