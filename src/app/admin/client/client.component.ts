import { Subscription } from 'rxjs';
import { GetService } from './../services/get.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { MatPaginator, MatTableDataSource } from '@angular/material';


interface Client {
  idCli: number;
  nomCli: string;
  prenomCli: string;
  numTelCli: string;
  adresseCli: string;
  emailCli: string;
}

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.css']
})
export class ClientComponent implements OnInit {
  @ViewChild (MatPaginator, {static: false}) clientPaginator: MatPaginator;
  faSearch = faSearch;

  clients: Client[] = [ ];
  columnClients: string[] = ['idCli', 'nomCli', 'prenomCli', 'numTelCli', 'adresseCli', 'emailCli'];
  clientSub: Subscription;

  img = '../../../assets/images/client.png';

  clientDatasource = new MatTableDataSource(this.clients);

  constructor(private getSrv: GetService) { }

  ngOnInit() {
    this.clientSub = this.getSrv.clientSubject.subscribe(
      (result: any[]) => {
        this.clients = result;
        this.clientDatasource.data = this.clients;
      }
    );
    this.getClients();
   
    this.clientDatasource.paginator = this.clientPaginator;
  }

  getClients() {
    this.getSrv.getClient();
  }

  filterClient(value: string) {
    this.clientDatasource.filter = value.trim().toLowerCase();
  }

}
