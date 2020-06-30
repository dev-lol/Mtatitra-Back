import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-produit',
  templateUrl: './produit.component.html',
  styleUrls: ['./produit.component.css']
})
export class ProduitComponent implements OnInit {
  img = '../../../assets/images/produit.png';
  constructor() { }

  ngOnInit() {
  }

}
