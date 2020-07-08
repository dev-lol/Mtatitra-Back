import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AcceuilComponent } from './acceuil/acceuil.component';
import { ClientformComponent } from './clientform/clientform.component';
import { MailconfirmationComponent } from './mailconfirmation/mailconfirmation.component';
import { SignupComponent } from './signup/signup.component';
import { ProfileclientComponent } from './profileclient/profileclient.component';
import { AuthGuard } from './login/auth.guard';
import { NotfoundComponent } from './notfound/notfound.component';
import { LogoutGuard } from './login/logout.guard';
import { EditComponent } from './edit/edit.component';
import { TarifComponent } from './tarif/tarif.component';
import { ListComponent } from './list/list.component';


const routes: Routes = [
    { path: '', redirectTo: '/acceuil', pathMatch: 'full' },
    { path: 'acceuil', component: AcceuilComponent },
    { path: 'login', component: LoginComponent, canActivate: [LogoutGuard] },
    { path: 'livrer', component: ClientformComponent, canActivate: [AuthGuard] },
    { path: 'mailconfirmation/:email/:code', component: MailconfirmationComponent, canActivate: [LogoutGuard] },
    { path: 'mailconfirmation/:email', component: MailconfirmationComponent, canActivate: [LogoutGuard] },
    { path: 'mailconfirmation', redirectTo: 'acceuil', canActivate: [LogoutGuard] },
    { path: 'signup', component: SignupComponent, canActivate: [LogoutGuard] },
    { path: 'list', component: ListComponent},
    { path: '404', component: NotfoundComponent },
    { path: 'profile', component: ProfileclientComponent, canActivate: [AuthGuard] },
    { path: 'profile/modifier', component: EditComponent, canActivate: [AuthGuard] },
    { path: 'tarif', component: TarifComponent},
    { path: '**', redirectTo: '404' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
exports: [RouterModule]
})
export class AppRoutingModule { }
export const routingComponents = [AcceuilComponent, LoginComponent, ClientformComponent, MailconfirmationComponent, SignupComponent, ProfileclientComponent, NotfoundComponent,EditComponent, TarifComponent,ListComponent]
