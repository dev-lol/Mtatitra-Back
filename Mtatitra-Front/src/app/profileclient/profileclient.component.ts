import { Component, OnInit } from '@angular/core';
import { LoginService } from '../login/login.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
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

    selectedIndex = 0
    constructor(
        private spinner: NgxSpinnerService,
        public profileService: ProfileclientService,
        private actRoute: ActivatedRoute,
        public formatter: FormatterService,
        private router: Router
    ) {
        this.spinner.show("profile")
        this.profileService.getUserProfile().subscribe(res => {
            this.currentUser = res.data
            this.spinner.hide("profile");
            console.log(this.currentUser)
        });


    }

    ngOnInit() {
        let params: ParamMap = this.router.parseUrl(this.router.url).queryParamMap
        if (params.has("tab")) {
            if (Number(params.get("tab")) < 2 && Number(params.get("tab")) >= 0)
                this.selectedIndex = Number(params.get("tab")) || 0
        }
    }

}
