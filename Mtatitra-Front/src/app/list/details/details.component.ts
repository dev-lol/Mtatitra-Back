import { Component, OnInit, Inject } from '@angular/core';
import { ListService } from '../list.service';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {
  id: number;
    depart: string;
    destination: string;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
   
  }

}
