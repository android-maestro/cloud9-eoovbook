import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  isLogin:boolean=false;
  storage = window.localStorage;

  constructor(){

    
  }
  ngOnInit() {

    var userData = JSON.parse(this.storage.getItem('userData') || '{}');
 var keys = Object.keys(userData);
var len = keys.length;
console.log(len);
if(len==0){
	this.isLogin = true;
	 // this.router.navigate(['login']);
}else{
	this.isLogin = false;
	 // this.router.navigate(['/index']);
}
    
  }
  title = 'new-eoovbook';
}
