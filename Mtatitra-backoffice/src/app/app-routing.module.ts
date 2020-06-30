import { AdminGuard } from './admin/login-admin/admin.guard';
import { LoginAdminComponent } from './admin/login-admin/login-admin.component';
import { TypeComponent } from './admin/type/type.component';
import { ZoneComponent } from './admin/zone/zone.component';
import { LivraisonComponent } from "./admin/livraison/livraison.component";
import { ProduitComponent } from "./admin/produit/produit.component";
import { CoursierComponent } from './admin/coursier/coursier.component';
import { ClientComponent } from './admin/client/client.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { AdminComponent } from "./admin/admin/admin.component";
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LogoutGuard } from './admin/login-admin/logout.guard';

import { TarifComponent } from './admin/tarif/tarif.component';



const routes: Routes = [
    {
        path: 'login',
        component: LoginAdminComponent,
        canActivate: [LogoutGuard]
    },
    {

        path: '',
        canActivate: [AdminGuard],
        component: AdminComponent,
        children: [

            {
                path: 'dashboard',
                component: DashboardComponent,

            },
            {
                path: 'client',
                component: ClientComponent
            },
            {
                path: 'coursier',
                component: CoursierComponent
            },
            {
                path: 'produit',
                component: ProduitComponent
            },
            {
                path: 'livraison',
                component: LivraisonComponent
            },
            {
                path: 'type',
                component: TypeComponent
            },
            {
                path: 'zone',
                component: ZoneComponent
            },
            {
                path: 'tarif',
                component: TarifComponent
              }
        ]
    },


    { path: '**', redirectTo: '404' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
export const routingComponents = [
    AdminComponent, DashboardComponent,
    ClientComponent, CoursierComponent, ProduitComponent, LivraisonComponent, ZoneComponent
];
