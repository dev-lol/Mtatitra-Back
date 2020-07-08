import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MailconfirmationService } from './mailconfirmation.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
    selector: 'app-mailconfirmation',
    templateUrl: './mailconfirmation.component.html',
    styleUrls: ['./mailconfirmation.component.css']
})
export class MailconfirmationComponent implements OnInit {

    codeForm: FormGroup
    email: string
    constructor(
        public fb: FormBuilder,
        public mailconfirmationService: MailconfirmationService,
        public currentRoute: ActivatedRoute,
        public router: Router
    ) {
        this.codeForm = this.fb.group({
            code: ['']
        })
        this.email = currentRoute.snapshot.params["email"]
        let code = currentRoute.snapshot.params["code"]
        if (code) {
            this.mailconfirmationService.checkConfirmation(this.email, code).subscribe((res: any) => {
                this.router.navigate(["login"])
            }, (error) => {
                this.router.navigate(["404"])
            })
        }
    }

    ngOnInit() {
    }
    resendCode(event: Event) {
        event.preventDefault()
        this.mailconfirmationService.resendCode(this.email)
    }
    confirmCode() {
        this.mailconfirmationService.checkConfirmation(this.email, this.codeForm.value["code"]).subscribe((res: any) => {
            this.router.navigate(["login"])
        }, (error) => {
            this.router.navigate(["404"])
        })
    }
}