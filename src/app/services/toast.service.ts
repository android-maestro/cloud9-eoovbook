import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
@Injectable({
  providedIn: 'root'
})
export class ToastService {
  
  constructor(private toastr: ToastrService) { }

  success(message, title){
  	console.log('yes');
      this.toastr.success(message, title);
  }
  
  error(message, title){
      this.toastr.error(message, title);
  }
  
  info(message, title){
      this.toastr.info(message, title);
  }
  
  warning(message, title){
      this.toastr.warning(message, title);
  }
}
