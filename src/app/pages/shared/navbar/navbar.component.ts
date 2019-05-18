import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HelperService } from 'src/app/services/helper.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ApiService } from 'src/app/services/api.service';
import * as firebase  from 'firebase';
import { AuthService } from 'src/app/services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  password;
  npassword;
  user;

  constructor(private router: Router, private helper: HelperService,
    private api: ApiService,
    private ngxService: NgxUiLoaderService,
    private auth: AuthService,
    private toastr: ToastrService) { }

  ngOnInit() {
  }

  
  logout(){
    localStorage.removeItem('rid');
    localStorage.removeItem('userType');
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  resetPassword(content){
    this.helper.openModel(content);
    this.password = '';
    this.npassword = '';
  }

  update(){
    if(this.password === this.npassword){
      this.ngxService.start();
      this.auth.login(this.user.email, this.user.password)
      .then(res =>{
            firebase.auth().onAuthStateChanged( user => {
            if (user){
            user.updatePassword(this.password)
              .then(res => {
                this.ngxService.stop();  
                this.helper.closeModel();
                this.toastr.success('Password Changed');
                this.user.password = this.password;
                this.api.updateUser(localStorage.getItem('rid'),this.user);
                        }, err =>{
                this.toastr.error(err.message,'Error!')
                this.ngxService.stop();  
              })
            } else { 
              this.ngxService.stop();  
                console.log(user)
            }
          });
      }, err =>{
        this.ngxService.stop();  
        this.toastr.error('Something Went Wrong.','Error.')
      })
     
    }
    else{
      this.toastr.error('Password Does not matches.','Password Error.')
    }
  }

}
