import { DisplayService } from './admin/services/display.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { StickyNavModule } from 'ng2-sticky-nav';
import { AppRoutingModule, routingComponents } from './app-routing.module';
import { AppComponent } from './app.component';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { EditorModule } from '@tinymce/tinymce-angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {
    MatSliderModule, MatStepperModule, MatIconModule, MatFormFieldModule, MatInputModule,
    MatTabsModule, MatTableModule, MatSortModule, MatPaginatorModule, MatDialogModule,
    MatCheckboxModule, MatButtonModule, MatButtonToggleModule, MatRadioModule, MatOptionModule,
    MatSelectModule, MatTooltipModule, MatDatepickerModule, MatProgressSpinnerModule, MatDividerModule,
    MatProgressBarModule, MatExpansionModule, MatCardModule, DateAdapter, MatNativeDateModule,
    MatDatepicker, MatListModule, MatGridListModule, MatToolbarModule
} from '@angular/material';


import { FormBuilder, ReactiveFormsModule, ControlContainer, FormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts';

import { DatePipe } from '@angular/common';


import { SocketComponent } from './socket/socket.component';
import { SocketService } from './socket/socket.service';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';




import { AdminComponent } from "./admin/admin/admin.component";
import { ClientComponent } from './admin/client/client.component';
import { CoursierComponent } from './admin/coursier/coursier.component';
import { ProduitComponent } from "./admin/produit/produit.component";
import { LivraisonComponent } from './admin/livraison/livraison.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { ZoneComponent } from './admin/zone/zone.component';
import { HeaderComponent } from './admin/header/header.component';
import { TypeComponent } from './admin/type/type.component';
import { DetailTypeComponent } from './admin/type/detail-type/detail-type.component';
import { DetailZoneComponent } from './admin/zone/detail-zone/detail-zone.component';
import { DetailCoursierComponent } from './admin/coursier/detail-coursier/detail-coursier.component';
import { LoginAdminComponent } from './admin/login-admin/login-admin.component';
import { AuthInterceptor } from './admin/login-admin/authconfig.interceptor.ts ';
import { NgxSpinnerComponent, NgxSpinnerModule } from 'ngx-spinner'
import { TarifComponent } from './admin/tarif/tarif.component';
import { DatelimitComponent } from './admin/datelimit/datelimit.component';
import { DetailDateComponent } from './admin/datelimit/detail-date/detail-date.component';

@NgModule({
    entryComponents: [
        // Ici Aussi pour MatDialog
        DetailTypeComponent,
        DetailZoneComponent,
        DetailCoursierComponent,
        DetailDateComponent
    ],
    declarations: [
        AppComponent,
        routingComponents,
        SocketComponent,
        AdminComponent,
        ClientComponent,
        CoursierComponent,
        ProduitComponent,
        LivraisonComponent,
        DashboardComponent,
        ZoneComponent,
        HeaderComponent,
        TypeComponent,
        DetailTypeComponent,
        DetailZoneComponent,
        DetailCoursierComponent,
        LoginAdminComponent,
        TarifComponent,
        DatelimitComponent,
        DetailDateComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        StickyNavModule,
        AngularFontAwesomeModule,
        FontAwesomeModule,
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
        HttpClientModule,
        MatListModule,
        MatGridListModule,
        MatToolbarModule,
        NgxSpinnerModule,
        ChartsModule
    ],
    providers: [
        FormBuilder,
        DatePipe,
        MatDatepicker,
        SocketService,
        DisplayService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptor,
            multi: true
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
