import { Component, OnInit } from '@angular/core';
import { SocketService } from './socket.service';

@Component({
  selector: 'app-socket',
  templateUrl: './socket.component.html',
  styleUrls: ['./socket.component.css']
})
export class SocketComponent implements OnInit {

  title = 'socket-io';

  constructor(private socketService : SocketService) { }

  ngOnInit() {
    this.socketService.setupSocketConnection();
  }

}
