import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HelperService {

  userType: BehaviorSubject<string>;

  constructor() {
    if(localStorage.getItem('userType'))
      this.userType = new BehaviorSubject<string>(localStorage.getItem('userType'));
    else
      this.userType = new BehaviorSubject<string>('');
   }

   getUserType(){
     return this.userType.asObservable();
   }

   setUserType(value: string){
     this.userType.next(value);
   }
}
