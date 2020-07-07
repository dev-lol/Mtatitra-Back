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
  currentDatelimit: Datelimit = null;

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

  deleteDateLimit(datelimit: Datelimit){
    this.currentDatelimit = datelimit
    open()
  }
  confirmDelete() {
    this.deleteSrv.deleteLimiteDat(this.currentDatelimit.idLimiteDat);
    this.currentDatelimit = null;
    close();
  }

  editDateLimit(datelimit: Datelimit){
     const id = datelimit.idLimiteDat
    const designation = datelimit.limiteDat

    const dialogRef = this.dialog.open(DetailDateComponent,{
      data : {id : id,designation : designation}
    })
    dialogRef.afterClosed().subscribe(result=> console.log(""))
    
  } 
 

}
