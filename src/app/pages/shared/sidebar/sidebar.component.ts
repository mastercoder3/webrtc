import { Component, OnInit } from '@angular/core';
import { HelperService } from 'src/app/services/helper.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  type;

  constructor(private helper: HelperService) { }

  ngOnInit() {
    this.helper.getUserType().subscribe(res =>{
      this.type = res;
    });
  }

}
