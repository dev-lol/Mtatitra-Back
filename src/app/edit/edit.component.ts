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

    //validation mail mail
    email = new FormControl('', [Validators.required, Validators.email]);

    // hidden password
    hide = true;

    form: FormGroup;
    editForm: FormGroup;
    getErrorMessage() {
        if (this.email.hasError('required')) {
            return 'Vous devrez entrer une valeur';
        }
        return this.email.hasError('email') ? 'Not a valid email' : '';
    }
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
            nom: [''],
            prenom: [''],
            telephone: [''],
            adresse: [''],
            email: this.email
        });
        this.profileService.getUserProfile().subscribe(res => {
            this.currentUser = res.data
            this.editForm.controls['nom'].setValue(this.currentUser["nomCli"])
            this.editForm.controls['prenom'].setValue(this.currentUser["prenomCli"])
            this.editForm.controls['telephone'].setValue(this.currentUser["numTelCli"])
            this.editForm.controls['adresse'].setValue(this.currentUser["adresseCli"])
            this.editForm.controls['email'].setValue(this.currentUser["emailCli"])
            this.spinner.hide("edit")
        })



        //confirmation mot de passe 
        this.form = this.fb.group({
            oldPassword: ['', Validators.required],
            newPassword: ['', Validators.required],
            confirmPassword: ['', Validators.required]
        });
    }




    modifierUser() {
        let editValue = { ...this.form.value, ...this.editForm.value }

        editValue["nomCli"] = editValue["nom"]
        delete (editValue["nom"])
        editValue["prenomCli"] = editValue["prenom"]
        delete (editValue["prenom"])
        editValue["adresseCli"] = editValue["adresse"]
        delete (editValue["adresse"])
        editValue["passCli"] = editValue["password"]
        delete (editValue["password"])
        editValue["emailCli"] = Object.values(this.email.value).join("")
        delete (editValue["email"])
        editValue["numTelCli"] = editValue["telephone"]
        delete (editValue["telephone"])
        console.log(editValue)
        if (!this.isShow) {
            delete editValue["newPassword"]
            delete editValue["oldPassword"]
        }
        delete editValue["confirmPassword"]

        this.editService.edit(editValue).subscribe((res) => {
            this.editForm.reset()
            this.form.reset()
            this.router.navigate(["profile"])
        }, (error) => {
            this.router.navigate(["profile"])
        })
    }

}
