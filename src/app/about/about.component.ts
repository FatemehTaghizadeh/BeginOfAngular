import { Component, OnInit } from '@angular/core';
import{Params } from '@angular/router';
import {Leader} from '../shared/leader';
import{LeaderService} from '../services/leader.service';
@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {

  leader:Leader;
  leaders:Leader[];
  constructor( 
    private leaderService:LeaderService,
    ) { }

  ngOnInit() {
      this.leaders=this.leaderService.getLeaders();
  }

}
