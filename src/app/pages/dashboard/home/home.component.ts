import { Component, OnInit } from '@angular/core';
import { WebrtcService } from 'src/app/services/webrtc.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private rtc: WebrtcService) { }

  ngOnInit() {
    this.rtc.setFocus(false);
  }

  open(){
    this.rtc.open('jd123123');
  }

  join(){
    this.rtc.join('jd123123');
  }

}
