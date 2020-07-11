import { DetailTypeComponent } from './detail-type/detail-type.component';
import { MatDialog, MatPaginator, MatTableDataSource } from '@angular/material';
import { DeleteService } from './../services/delete.service';
import { GetService } from './../services/get.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { faPlusCircle, faEdit, faMinusCircle } from '@fortawesome/free-solid-svg-icons';
import { PostService } from './../../admin/services/post.service';
import { Subscription } from 'rxjs';

// changer
function open() {
    document.getElementById('btn_open').click();
}

function close() {
    document.getElementById('close').click();
}


export interface TypeCoursier {
    idTypeCou: number;
    typeCou: string;

    poidsMaxTypeCou: number;
}

export interface TypeProduit {
    idTypePro: number;
    typePro: string;
}

@Component({
    selector: 'app-type',
    templateUrl: './type.component.html',
    styleUrls: ['./type.component.css']
})
export class TypeComponent implements OnInit {

    @ViewChild('typeProduit', { static: false }) produitPaginator: MatPaginator;
    @ViewChild('typeCoursier', { static: false }) coursierPaginator: MatPaginator;
    img = '../../../assets/images/type.png';

    coursiersSub: Subscription;
    produitsSub: Subscription;

    typeCoursierAdded = '';
    poidsMaxAdded = '';
    typeProduitAdded = '';

    faPlusCircle = faPlusCircle;
    faEdit = faEdit;
    faMinusCircle = faMinusCircle;

    columnCoursier: string[] = ['idCou', 'typeCou', 'poidsMaxTypeCou', 'edit', 'suppr'];
    columnProduit: string[] = ['idProd', 'typeProd', 'edit', 'suppr'];

    coursiers: TypeCoursier[] = [];

    produits: TypeProduit[] = []

    coursierDataSource: MatTableDataSource<TypeCoursier> = new MatTableDataSource(this.coursiers);
    produitDataSource: MatTableDataSource<TypeProduit> = new MatTableDataSource(this.produits);

    // changer
    currentCoursier: TypeCoursier = null;
    currentProduit: TypeProduit = null;
    currentType = '';

    constructor(private postSrv: PostService, private getSrv: GetService,
        private deleteSrv: DeleteService, public dialog: MatDialog) { }

    ngOnInit() {
        this.initType();
    }

    ngAfterViewInit() {
        this.coursierDataSource.paginator = this.coursierPaginator
        this.produitDataSource.paginator = this.produitPaginator
    }

    initType() {
        this.coursiersSub = this.getSrv.typeCoursierSubject.subscribe(
            (types: any[]) => {
                this.coursiers = types;
                this.coursierDataSource.data = this.coursiers
            }
        );

        this.produitsSub = this.getSrv.typeProduitSubject.subscribe(
            (types: any[]) => {
                this.produits = types;
                this.produitDataSource.data = this.produits
            }
        );

        this.getAllType();
    }

    getAllType() {
        this.getSrv.getAllType();
    }

    addTypeCoursier() {
        this.postSrv.addTypeCoursier({ typeCou: this.typeCoursierAdded, poidsMaxTypeCou: this.poidsMaxAdded }).subscribe(res => {
            this.getSrv.getAllTypeCoursier()
            this.typeCoursierAdded = '';
            this.poidsMaxAdded = ''
        }, error => {
            console.log(error)
        })
    }

    addTypeProduit() {
        this.postSrv.addTypeProduit(this.typeProduitAdded);
        this.typeProduitAdded = '';
    }

    deleteTypeCoursier(cou: TypeCoursier) {
        this.currentCoursier = cou;
        this.currentType = 'Coursier';
        open();
    }

    deleteTypeProduit(pro: TypeProduit) {
        this.currentProduit = pro;
        this.currentType = 'Produit';
        open();
    }
    // changer
    confirmDelete() {
        if (this.currentType === 'Coursier') {
            this.deleteSrv.deleteTypeCoursier(this.currentCoursier.idTypeCou);
            this.currentCoursier = null;
        } else if (this.currentType === 'Produit') {
            this.deleteSrv.deleteTypeProduit(this.currentProduit.idTypePro);
            this.currentProduit = null;
        }
        this.currentType = '';
        close();
    }

    editTypeCoursier(typeCoursier: TypeCoursier) {
        const id = typeCoursier.idTypeCou;
        const designation = typeCoursier.typeCou;
        const poidsMax = typeCoursier.poidsMaxTypeCou
        const dialogRef = this.dialog.open(DetailTypeComponent, { data: { type: 'coursier', id, designation, poidsMax } });
        dialogRef.afterClosed().subscribe(
            result => {
                // this.getSrv.getAllTypeCoursier();
            }
        );
    }

    editTypeProduit(produit: TypeProduit) {
        const id = produit.idTypePro;
        const designation = produit.typePro;
        const dialogRef = this.dialog.open(DetailTypeComponent, { data: { type: 'produit', id, designation } });
        dialogRef.afterClosed().subscribe(
            result => {
                // this.getSrv.getAllTypeProduit();
            }
        );
    }
}
