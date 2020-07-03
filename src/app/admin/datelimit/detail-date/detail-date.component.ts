import { Component, OnInit, Inject } from '@angular/core';
import { Datelimit } from '../datelimit.component';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { MAT_DIALOG_DATA } from '@angular/material';
import { PutService } from '../../services/put.service';

function close() {
    document.getElementById('btn_close').click();
}

@Component({
    selector: 'app-detail-date',
    templateUrl: './detail-date.component.html',
    styleUrls: ['./detail-date.component.css']
})
export class DetailDateComponent implements OnInit {

    limitDate: Datelimit = { idLimiteDat: 0, limiteDat: '' }
    faTimesCircle = faTimesCircle
    id: number
    designation: string

    constructor(@Inject(MAT_DIALOG_DATA) public data: any, private putSrv: PutService) { }

    ngOnInit() {
        this.id = this.data.id
        this.designation = this.data.designation
    }

    modifier() {
        this.limitDate.idLimiteDat = this.id
        this.limitDate.limiteDat = this.designation
        this.putSrv.editLimitDate(this.id, this.limitDate)
        close()
    }

}
