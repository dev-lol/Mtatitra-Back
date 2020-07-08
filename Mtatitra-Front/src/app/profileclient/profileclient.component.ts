import { Component, OnInit } from '@angular/core';
import { LoginService } from '../login/login.service';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ProfileclientService } from './profileclient.service';
import { FormatterService } from '../services/formatter.service';

@Component({
    selector: 'app-profileclient',
    templateUrl: './profileclient.component.html',
    styleUrls: ['./profileclient.component.css']
})
export class ProfileclientComponent implements OnInit {

    currentUser: object = {
        nomCli: '',
        prenomCli: '',
        numTelCli: '',
        adresseCli: '',
    };

    constructor(
        private spinner: NgxSpinnerService,
        public profileService: ProfileclientService,
        private actRoute: ActivatedRoute,
        public formatter: FormatterService
    ) {
        this.spinner.show("profile")
        this.profileService.getUserProfile().subscribe(res => {
            this.currentUser = res.data
            this.spinner.hide("profile");
            console.log(this.currentUser)
        });


    }

    ngOnInit() {
    }

}
