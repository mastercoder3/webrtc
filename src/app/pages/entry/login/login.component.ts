import { Component, OnInit, NgZone } from '@angular/core';
import {Router} from '@angular/router';
import { FormGroup , Validators, FormBuilder} from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/services/api.service';
import { HelperService } from 'src/app/services/helper.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  form: FormGroup;
  error: boolean=false;
  errMsg;
  user;

  constructor(private router: Router, private fb: FormBuilder, private ngzone: NgZone, private auth: AuthService, 
    private toastr: ToastrService, private api: ApiService, private helper: HelperService) { }

  ngOnInit() {
    this.form = this.fb.group({
      email: ['', Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.email
      ])],
      password: ['', Validators.compose([
        Validators.required
      ])]
    });
  }

  get f() { return this.form.controls; }

  onSubmit(email,password){
    this.auth.login(email,password)
      .then(res => {
        this.api.getUser(res.user.uid)
          .subscribe((ress:any) =>{
            if(ress){
              this.auth.setPersistance();
              localStorage.setItem('rid',res.user.uid);
              localStorage.setItem('userType',ress.type);
              this.helper.setUserType(ress.type)
              this.ngzone.run(() => this.router.navigate(['/dashboard/home']).then(res =>{
                location.reload();
              })).then();
            }
          })
      }, err =>{ 
        this.toastr.error(err.message, 'Login Error!');
      })
  }

}
