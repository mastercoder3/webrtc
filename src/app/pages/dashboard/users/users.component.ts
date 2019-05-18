import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { map } from 'rxjs/operators';
import { HelperService } from 'src/app/services/helper.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Subscription } from 'rxjs';

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
  data ={
    email: '',
    password: '',
    address:'',
    type: 'user'
  };
  $ob1: Subscription;

  constructor(private api: ApiService, private helper: HelperService, private toastr: ToastrService, private auth: AuthService,
    private ngxService: NgxUiLoaderService,) { }

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

  addUser(content){
    this.helper.openModelLg(content);
  }
  
  Submit(){
    if(this.data.email !== '' && this.data.password !== '' && this.data.address !== ''){
      this.ngxService.start();
      this.auth.signup(this.data.email, this.data.password)
        .then(res =>{
          this.api.createUser(res.user.uid,this.data)
            .then(ress =>{
              this.ngxService.stop();
              this.helper.closeModel();
              this.toastr.success('User Account Created Successfully.','Operation Completed.')
              this.data.email = '';
              this.data.password ='';
              this.data.address = '';
            }, err =>{
              this.ngxService.stop();
              this.toastr.error(err.message,'Error While creating User.');
            })
        }, err =>{
          this.ngxService.stop();
          this.toastr.error(err.message,'Error While creating User.');
        })
    }
    else{
      this.toastr.warning('Cannot Proceed. Please fill the form.','Warning!');
    }
  }

  delete(item){
    if(confirm(`Do You want to delete ${item.email}?`)){
        this.$ob1 = this.helper.deleteUser(item.did).subscribe((res:any) =>{
        if(res.statusText === 'OK' || res.status===200){
          this.api.deleteUser(item.did)
            .then(ress =>{
              this.toastr.success('User deleted.','Operation Completed.');
              this.$ob1.unsubscribe();
            }, err =>{
              this.$ob1.unsubscribe();
              this.toastr.error(err.message, 'Erro!');
            });
        }
      });
    }
   
  }

}
