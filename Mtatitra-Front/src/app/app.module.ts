import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { StickyNavModule } from 'ng2-sticky-nav';
import { AppRoutingModule, routingComponents } from './app-routing.module';
import { AppComponent } from './app.component';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { EditorModule } from '@tinymce/tinymce-angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSliderModule, MatStepperModule, MatIconModule, MatFormFieldModule, MatInputModule, MatTabsModule, MatTableModule, MatSortModule, MatPaginatorModule, MatDialogModule, MatCheckboxModule, MatButtonModule, MatButtonToggleModule, MatRadioModule, MatOptionModule, MatSelectModule, MatTooltipModule, MatDatepickerModule, MatProgressSpinnerModule, MatDividerModule, MatProgressBarModule, MatExpansionModule, MatCardModule, DateAdapter, MatNativeDateModule, MatDatepicker } from '@angular/material';
import { FormBuilder, ReactiveFormsModule, ControlContainer, FormsModule } from '@angular/forms';
import { NavbarComponent } from './navbar/navbar.component';
import { DatePipe } from '@angular/common';
import { SignupComponent } from './signup/signup.component';
import { MailconfirmationComponent } from './mailconfirmation/mailconfirmation.component';
import { ProfileclientComponent } from './profileclient/profileclient.component';
import { SocketService } from './socket/socket.service';
import { LoginService } from './login/login.service';
import { HttpClientModule, HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { AuthInterceptor } from './login/authconfig.interceptor.ts ';
import { NotfoundComponent } from './notfound/notfound.component';
import { NgxSpinnerModule } from "ngx-spinner";
import { EditComponent } from './edit/edit.component';
import { ListComponent } from './list/list.component';
import { DetailsComponent } from './list/details/details.component';
import { ProduitComponent } from './list/produit/produit.component';
import { EditService } from './edit/edit.service';
import { ListService } from './list/list.service';
import { ClientformService } from './clientform/clientform.service';
import { ProfileclientService } from './profileclient/profileclient.service';
import { MailconfirmationService } from './mailconfirmation/mailconfirmation.service';
import { RouterModule } from '@angular/router';
import { TarifService } from './tarif/tarif.service';
import { RapportComponent } from './list/rapport/rapport.component';
import { NgwWowModule } from 'ngx-wow'
import { NgxMatSelectSearchModule } from "ngx-mat-select-search";



@NgModule({
    declarations: [
        AppComponent,
        routingComponents,
        NavbarComponent,
        SignupComponent,
        MailconfirmationComponent,
        ProfileclientComponent,
        NotfoundComponent,
        EditComponent,
        ListComponent,
        DetailsComponent,
        ProduitComponent,
        RapportComponent
    ],
    entryComponents: [DetailsComponent, ProduitComponent, RapportComponent],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        StickyNavModule,
        AngularFontAwesomeModule,
        EditorModule,
        BrowserAnimationsModule,
        MatStepperModule,
        MatSliderModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatTabsModule,
        MatTableModule,
        MatSortModule,
        MatPaginatorModule,
        MatDialogModule,
        MatCheckboxModule,
        MatButtonModule,
        MatButtonToggleModule,
        MatRadioModule,
        MatOptionModule,
        MatSelectModule,
        MatTooltipModule,
        MatDatepickerModule,
        MatButtonModule,
        MatProgressSpinnerModule,
        MatDividerModule,
        MatProgressBarModule,
        MatCardModule,
        MatExpansionModule,
        ReactiveFormsModule,
        FormsModule,
        MatNativeDateModule,
        MatTabsModule,
        NgxSpinnerModule,
        RouterModule,
        NgwWowModule,
        NgxMatSelectSearchModule
    ],
    providers: [
        FormBuilder,
        DatePipe,
        MatDatepicker,
        SocketService,
        LoginService,
        EditService,
        ListService,
        ClientformService,
        ProfileclientService,
        MailconfirmationService,
        TarifService,
        HttpClient,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptor,
            multi: true
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
