import { AdminGuard } from './admin/login-admin/admin.guard';
import { LoginAdminComponent } from './admin/login-admin/login-admin.component';
import { TypeComponent } from './admin/type/type.component';
import { ZoneComponent } from './admin/zone/zone.component';
import { LivraisonComponent } from "./admin/livraison/livraison.component";
import { CoursierComponent } from './admin/coursier/coursier.component';
import { ClientComponent } from './admin/client/client.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { AdminComponent } from "./admin/admin/admin.component";
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LogoutGuard } from './admin/login-admin/logout.guard';

import { TarifComponent } from './admin/tarif/tarif.component';
import { DatelimitComponent } from './admin/datelimit/datelimit.component';
import { PlanningComponent } from './admin/planning/planning.component';
import { EtapesComponent } from './admin/etapes/etapes.component';



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
                path: '',
                redirectTo: '/dashboard',
                pathMatch: 'full'
            },
            {
                path: 'dashboard',
                component: DashboardComponent,

            },
            {
                path : "planning",
                component : PlanningComponent
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
            },
            {
                path : "etape",
                component : EtapesComponent
            },
            {
                path: 'date',
                component: DatelimitComponent
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
    ClientComponent, CoursierComponent, LivraisonComponent, ZoneComponent
];
