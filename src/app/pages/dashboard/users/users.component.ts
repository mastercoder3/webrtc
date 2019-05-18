import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  pageNumber= 1;
  user={
    email:''
  };
  users:Array<any>=[];
  showSpinner=true;

  constructor(private api: ApiService) { }

  ngOnInit() {
    this.api.getAllUsers()
      .pipe(map(actions => actions.map(a=>{
        const data = a.payload.doc.data();
        const did = a.payload.doc.id;
        return {did, ...data};
      })))
        .subscribe((res: Array<any>) =>{
          this.users = res;
          this.showSpinner = false;
        });
  }

}
