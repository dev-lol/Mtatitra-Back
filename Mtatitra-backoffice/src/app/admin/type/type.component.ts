import { DetailTypeComponent } from './detail-type/detail-type.component';
import { MatDialog } from '@angular/material';
import { DeleteService } from './../services/delete.service';
import { GetService } from './../services/get.service';
import { Component, OnInit } from '@angular/core';
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
  img = '../../../assets/images/type.png';

  coursiersSub: Subscription;
  produitsSub: Subscription;

  typeCoursierAdded = '';
  typeProduitAdded = '';

  faPlusCircle = faPlusCircle;
  faEdit = faEdit;
  faMinusCircle = faMinusCircle;

  columnCoursier: string[] = ['idCou', 'typeCou', 'edit', 'suppr'];
  columnProduit: string[] = ['idProd', 'typeProd', 'edit', 'suppr'];

  coursiers: TypeCoursier[] = [];

  produits: TypeProduit[] = []

  // changer
  currentId = 0;
  currentType = '';

  constructor(private postSrv: PostService, private getSrv: GetService,
              private deleteSrv: DeleteService, public dialog: MatDialog) { }

  ngOnInit() {
    this.initType();
  }

  initType() {
    this.coursiersSub = this.getSrv.typeCoursierSubject.subscribe(
      (types: any[]) => {
        this.coursiers = types;
      }
    );

    this.produitsSub = this.getSrv.typeProduitSubject.subscribe(
      (types: any[]) => {
        this.produits = types;
      }
    );

    this.getAllType();
  }

  getAllType() {
    this.getSrv.getAllType();
  }

  addTypeCoursier() {
    this.postSrv.addTypeCoursier(this.typeCoursierAdded);
    this.typeCoursierAdded = '';
  }

  addTypeProduit() {
    this.postSrv.addTypeProduit(this.typeProduitAdded);
    this.typeProduitAdded = '';
  }

  deleteTypeCoursier(id: number) {
    this.currentId = id;
    this.currentType = 'Coursier';
    open();
  }

  deleteTypeProduit(id: number) {
    this.currentId = id;
    this.currentType = 'Produit';
    open();
  }
 // changer
    confirmDelete() {
      if (this.currentType === 'Coursier') {
        this.deleteSrv.deleteTypeCoursier(this.currentId);
      } else if (this.currentType === 'Produit') {
        this.deleteSrv.deleteTypeProduit(this.currentId);
      }
      this.currentId = 0;
      this.currentType = '';
      close();
    }

  editTypeCoursier(index: number) {
    const id = this.coursiers[index].idTypeCou;
    const designation = this.coursiers[index].typeCou;
    const dialogRef = this.dialog.open(DetailTypeComponent, {data: {type: 'coursier', id, designation}});
    dialogRef.afterClosed().subscribe(
      result => {
        // this.getSrv.getAllTypeCoursier();
      }
    );
  }

  editTypeProduit(index: number) {
    const id = this.produits[index].idTypePro;
    const designation = this.produits[index].typePro;
    const dialogRef = this.dialog.open(DetailTypeComponent, {data: {type: 'produit', id, designation}});
    dialogRef.afterClosed().subscribe(
      result => {
        // this.getSrv.getAllTypeProduit();
      }
    );
  }
}
