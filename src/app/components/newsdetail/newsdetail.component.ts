import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, NG_VALIDATORS, AbstractControl} from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { ActivatedRoute, Router,NavigationExtras } from '@angular/router';
import { EmojiModule } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { ToastService } from '../../services/toast.service';
import { Meta, MetaDefinition } from '@angular/platform-browser';

@Component({
  selector: 'app-newsdetail',
  templateUrl: './newsdetail.component.html',
  styleUrls: ['./newsdetail.component.css']
})
export class NewsdetailComponent implements OnInit {
  isLoading: boolean = false;
  newsId:any;
  data:any;
  Data:any;
  LoginId:any;
  trending:any;
  userData:any;
  NewsHeadline:any;
  commentnews:any;
  newsCount: any;
  profilePic:string='';
  viewnews: any;
  likednews:boolean=false;
  toggled: boolean = false;
  message: string = '';
  baseUrl: string;
  likeclick: boolean = false;
  newsLink: any;
  role:any;
  
  storage = window.localStorage;
  commentform: FormGroup = new FormGroup({});

  constructor(private fb: FormBuilder,
    private http: ApiService,
    public router: Router,
    private route: ActivatedRoute,
    public toast:ToastService,
    private metaService: Meta) {
      this.addTag();

      this.baseUrl = window.location.origin;

  	 this.route.queryParams.subscribe(params => {
      if (params) {
        this.newsId = params['newsId'];             }
       });

       
       this.commentform = this.fb.group({
        NewsId: ['', Validators.required ],
        LoginId: ['', Validators.required],
        NewsComment: ['', Validators.required]
        });

     }

  ngOnInit(): void {
    

    this.userData = JSON.parse(this.storage.getItem('userData') || '{}');
    this.profilePic = this.userData.ProfileImage;
    this.role = this.userData.UserRole;
    
    this.fetchcomment();

  	var userData = JSON.parse(this.storage.getItem('userData') || '{}');

    if (!this.storage.getItem('userData')) {

      let navigationExtras: NavigationExtras = {
        queryParams: {
          newsId:this.newsId
        }
      };
     
      this.router.navigate(['/SingleNews'], navigationExtras);
    }

    
  	 	 this.http.get('/TrendingNewsLeftPanel/'+userData.Email+'/10/0').subscribe(
        (res: any) => {
          if(res.status==true) {
          	this.trending = res.data;
          }else{          }
        },
        (error: any) => {
        }
      );

      // this.newsdwtail();

  	 this.viewCount();
  }

  like(){
    // this.Data.LikesCount=1;
    this.likeclick = !this.likeclick;
    var userData = JSON.parse(this.storage.getItem('userData') || '{}');
    var formData: FormData = new FormData();
    formData.append('LoginId', userData.Email);
    console.warn(userData.Email);
    this.http.post('/LikeNews/'+this.newsId+'/'+userData.Email,this.likednews).subscribe(
      (res:any)=>{
        if(res.status==true) {
          this.likednews = res.data;
          this.newsdetail();
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
      this.commentform.reset();
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
    this.newsId = id;
    window.history.pushState('newsdetail?newsId=', 'Title', 'newsdetail?newsId='+id);
    this.http.get('/NewsDetail/'+id).subscribe(
      (res: any) => {
        if(res.status==true) {
          this.Data = res.data.Detail;
          this.newsLink = res.data.NewsImageLinks;
          console.log(this.newsLink.DataText);
        }else{          }
      },
      (error: any) => {
      }
    );
  }

  editNews(){
    this.router.navigate(['/editnews/'+this.newsId]);
  }
  
  handleSelection(event) {
    console.log(event.char);
    this.message += event.char;
  }

  openLinkedin(id){
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
    window.open('https://www.linkedin.com/sharing/share-offsite/?url='+ encodeURIComponent(selBox.value)); 
  }


  newsdetail(){ 
    
    this.http.get('/NewsDetail/'+this.newsId).subscribe(
      (res: any) => {
        if(res.status==true) {
          this.Data = res.data.Detail;
          this.isLoading = false;
          this.newsLink = res.data.NewsImageLinks;
          console.log(this.Data);
        }else{          }
      },
      (error: any) => {
      }
    );
  }

  viewCount(){
    // this.Data.LikesCount=1;
    this.isLoading = true;
    var userData = JSON.parse(this.storage.getItem('userData') || '{}');
    var formData: FormData = new FormData();
    formData.append('LoginId', userData.Email);
    console.warn(userData.Email)
    this.http.post('/ViewNews/'+this.newsId+'/'+userData.Email,null).subscribe(
      (res:any)=>{
        if(res.status==true) {
          this.likednews = res.data;
          this.newsdetail();
        }else{          }
      },
      (error: any) => {
      });
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


  addTag() {
    
    // this.metaService.addTag({ property: 'og:title', content: this.Data.NewsHeadline });
    // this.metaService.addTag({ property: 'og:image', content: this.Data.ImageName });
  }
}
