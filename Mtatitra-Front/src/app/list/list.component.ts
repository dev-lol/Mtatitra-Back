import { Component, OnInit, ViewChild, Inject, ChangeDetectorRef, ViewChildren, Query, QueryList } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import { ListService } from './list.service';
import { catchError } from 'rxjs/operators';
import { DetailsComponent } from './details/details.component';
import { ProduitComponent } from './produit/produit.component';

@Component({
    selector: 'app-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

    liv: Livraison[] = []

    displayedColumns = ['idLiv', 'departLiv', 'destinationLiv', 'dateLiv', 'expressLiv', 'etats', 'produits', 'details'];

    tab = ["planifie", "enCours", "historique"]
    selectedIndex = 0
    sortValue = ''
    @ViewChild('planifie', { static: false }) paginatorPlanifie: MatPaginator;
    @ViewChild('enCours', { static: false }) paginatorEnCours: MatPaginator;
    @ViewChild('historique', { static: false }) paginatorHistorique: MatPaginator;

    @ViewChild(MatSort, { static: false }) sort: MatSort;

    livraison: any = { planifie: [], enCours: [], historique: [] }

    dataSourcePlanifie = new MatTableDataSource(this.livraison["planifie"])
    dataSourceEnCours = new MatTableDataSource(this.livraison["enCours"])
    dataSourceHistorique = new MatTableDataSource(this.livraison["historique"])

    constructor(private listService: ListService, public dialog: MatDialog, private cdr: ChangeDetectorRef) {
    }


    ngOnInit() {
        this.listService.getLivraison().subscribe((res) => {
            this.livraison = res
            this.dataSourcePlanifie.data = this.livraison["planifie"]
            this.dataSourceEnCours.data = this.livraison["enCours"]
            this.dataSourceHistorique.data = this.livraison["historique"]
        })
    }

    ngAfterViewInit() {
        this.dataSourcePlanifie.paginator = this.paginatorPlanifie
        this.dataSourceEnCours.paginator = this.paginatorEnCours
        this.dataSourceHistorique.paginator = this.paginatorHistorique
        // this.dataSource.sort = this.sort
    }

    onTabChange(event) {
        setTimeout(() => {
            switch (this.selectedIndex) {
                case 0:
                    !this.dataSourcePlanifie.paginator ? this.dataSourcePlanifie.paginator = this.paginatorPlanifie : null
                    break
                case 1:
                    !this.dataSourceEnCours.paginator ? this.dataSourceEnCours.paginator = this.paginatorEnCours : null
                    break
                case 2:
                    !this.dataSourceHistorique.paginator ? this.dataSourceHistorique.paginator = this.paginatorHistorique : null
            }
        })
    }
    applyFilter() {
        this.dataSourceHistorique.filter = this.sortValue.trim().toLowerCase();
        this.dataSourceEnCours.filter = this.sortValue.trim().toLowerCase();
        this.dataSourcePlanifie.filter = this.sortValue.trim().toLowerCase();
    }
    openModalDetails(element) {

        const dialogRef = this.dialog.open(DetailsComponent, { data: { element } });
        dialogRef.afterClosed().subscribe(
            result => {
                // this.getSrv.getAllTypeProduit();
            }
        );
        console.log(element)
    }
    openModalProduits(produits) {
        const dialogRef = this.dialog.open(ProduitComponent, {  width: '70%', height:'50%', data: { produits} });
        dialogRef.afterClosed().subscribe(
            result => {
                // this.getSrv.getAllTypeProduit();
            }
        );
        console.log(produits)
    }
}

export interface Livraison {
    idLiv: string;
    departLiv: string;
    destinationLiv: string;
    expressLiv: boolean;
    dateLiv: string;
    descriptionLiv: string
    numRecepLiv: string
    produits: Array<any>
    sommeRecepLiv: number
}
