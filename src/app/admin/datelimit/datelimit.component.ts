import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { faPlusCircle, faEdit, faMinusCircle } from '@fortawesome/free-solid-svg-icons';
import { GetService } from './../services/get.service';
import { PostService } from '../services/post.service';
import { DeleteService } from '../services/delete.service';
import { MatDialog } from '@angular/material';
import { DetailDateComponent } from './detail-date/detail-date.component';

function open() {
  document.getElementById('btn_open').click();
}

function close() {
  document.getElementById('close').click();
}


export interface Datelimit{
  idLimiteDat : number,
  limiteDat : string
}

@Component({
  selector: 'app-datelimit',
  templateUrl: './datelimit.component.html',
  styleUrls: ['./datelimit.component.css']
})
export class DatelimitComponent implements OnInit {

  limitAdded = ""
  limitSub : Subscription
  columnLimit : string [] = ["idLimitDat","limitDat","edit","suppr"]
  dateLimit : Datelimit[] = []

  faPlusCircle = faPlusCircle;
  faEdit = faEdit;
  faMinusCircle = faMinusCircle;
  currentId = 0;

  constructor(private postSrv: PostService, private getSrv: GetService, public dialog: MatDialog,
    public deleteSrv: DeleteService) { }

  ngOnInit() {
    this.initDateLImit()
  }

  initDateLImit(){
    this.limitSub = this.getSrv.dateLimitSubject.subscribe(
      (limitDates : any[]) =>{
        this.dateLimit = limitDates
      }
    )
    this.getAllLimitDate()
  }

  getAllLimitDate(){
    this.getSrv.getLimitDate()
  }

  addDateLimit(){
    console.log(this.limitAdded)
    this.postSrv.addLimitDat(this.limitAdded)
    this.limitAdded = ""
  }

  deleteDateLimit(id: number){
    this.currentId = id
    open()
  }
  confirmDelete() {
    this.deleteSrv.deleteLimiteDat(this.currentId);
    this.currentId = 0;
    close();
  }

  editDateLimit(index : number){
    const id = this.dateLimit[index].idLimiteDat
    const designation = this.dateLimit[index].limiteDat

    const dialogRef = this.dialog.open(DetailDateComponent,{
      data : {id : id,designation : designation}
    })
    dialogRef.afterClosed().subscribe(result=> console.log(""))
  }

}
