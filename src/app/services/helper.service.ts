import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Http, RequestOptions, Headers  } from '@angular/http';

@Injectable({
  providedIn: 'root'
})
export class HelperService {

  userType: BehaviorSubject<string>;

  constructor(private modalService: NgbModal, private http: Http) {
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

   openModel(content){
    this.modalService.open(content, {backdrop: 'static'});
  }

  openModelLg(content){
    this.modalService.open(content, { size: 'lg', backdrop: 'static' });
  }

  closeModel(){
    this.modalService.dismissAll();
  }

  deleteUser(id){
    let myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    let options = new RequestOptions({ headers: myHeaders });
    //callrequest
    return this.http.post('https://us-central1-systemdefense1.cloudfunctions.net/deleteUser',{
      uid: id
    }, options);
  }
}
