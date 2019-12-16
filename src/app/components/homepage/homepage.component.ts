import { Component, OnInit } from '@angular/core';
import {ChatService} from '../../services/chat.service';
import {DataService} from '../../services/data.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {

  constructor(private chatService: ChatService,private dataservice:DataService) {  }

  ngOnInit() {
  
  }


}
