import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { FormGroup , Validators, FormBuilder} from '@angular/forms';

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

  constructor(private router: Router, private fb: FormBuilder) { }

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

}
