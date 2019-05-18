import { Component, NgZone } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private router: Router, private ngzone: NgZone){
    if(localStorage.getItem('rid'))
    this.ngzone.run(() => this.router.navigate(['/dashboard/home']).then(res =>{
    })).then();
  }
}
