import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { PasswordValidation } from './password-validator';
import { LoginService } from '../login/login.service';
import { Router } from '@angular/router';
import { EditService } from './edit.service';
import { ProfileclientService } from '../profileclient/profileclient.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
    selector: 'app-edit',
    templateUrl: './edit.component.html',
    styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {
    isShow = false;
    hidden: any;

    // hidden password
    hide = true;
    editForm: FormGroup;
    currentUser = []

    constructor(
        private spinner: NgxSpinnerService,
        public fb: FormBuilder,
        public editService: EditService,
        private profileService: ProfileclientService,
        public router: Router
    ) {

    }

    ngOnInit() {
        this.spinner.show("edit")
        this.editForm = this.fb.group({
            nomCli: ['', Validators.required],
            prenomCli: ['', Validators.required],
            numTelCli: ['', Validators.compose([Validators.required, Validators.pattern(/^3[2-49]\d{7}$/)])],
            adresseCli: ['', Validators.required],
            pageFbCli: [''],
            compteFbCli: [''],
            siteWebCli: [''],
            oldPassword: [''],
            newPassword: [''],
            confirmPassword: ['']
        });
        this.profileService.getUserProfile().subscribe(res => {
            this.currentUser = res.data
            this.editForm.controls['nomCli'].setValue(this.currentUser["nomCli"])
            this.editForm.controls['prenomCli'].setValue(this.currentUser["prenomCli"])
            this.editForm.controls['numTelCli'].setValue(this.currentUser["numTelCli"])
            this.editForm.controls['adresseCli'].setValue(this.currentUser["adresseCli"])
            this.editForm.controls['compteFbCli'].setValue(this.currentUser["compteFbCli"])
            this.editForm.controls['pageFbCli'].setValue(this.currentUser["pageFbCli"])
            this.editForm.controls['siteWebCli'].setValue(this.currentUser["siteWebCli"])
            this.editForm.markAllAsTouched()
            this.controls.newPassword.markAsUntouched()
            this.controls.oldPassword.markAsUntouched()
            this.controls.confirmPassword.markAsUntouched()
            this.spinner.hide("edit")
        })
    }




    modifierUser() {
        let editValue = { ...this.editForm.value }
        if (!this.isShow) {
            delete editValue["newPassword"]
            delete editValue["oldPassword"]
        }
        delete editValue["confirmPassword"]
        this.editService.edit(editValue).subscribe((res) => {
            this.router.navigate(["profile"])
        }, (error) => {
            if (error.error.errors) {
                for (const err of error.error.errors) {
                    this.editForm.get(err["param"]).setErrors({ serverError: err["msg"] })
                }
            }
        })
    }
    get controls() { return this.editForm.controls }

    toggle() {
        this.isShow = !this.isShow
        if (this.isShow) {
            this.controls.newPassword.setValidators(Validators.required)
            this.controls.oldPassword.setValidators(Validators.required)
            this.controls.confirmPassword.setValidators(Validators.required)
            this.controls.newPassword.updateValueAndValidity()
            this.controls.oldPassword.updateValueAndValidity()
            this.controls.confirmPassword.updateValueAndValidity()
        } else {
            this.controls.newPassword.setValidators(null)
            this.controls.oldPassword.setValidators(null)
            this.controls.confirmPassword.setValidators(null)
            this.controls.newPassword.updateValueAndValidity()
            this.controls.oldPassword.updateValueAndValidity()
            this.controls.confirmPassword.updateValueAndValidity()
        }
    }
}
