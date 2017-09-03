import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Client } from '../models/client';
import { ClientService } from '../services/client.service';

@Component({
	selector: 'app-clients',
	templateUrl: './clients.component.html',
	styleUrls: ['../shared-styles/list-elements.css', './clients.component.css']
})
export class ClientsComponent implements OnInit {
	selectedClient: Client;
	clients: Client[];

	constructor(
		private router: Router,
		private clientService: ClientService
	) { }

	ngOnInit() {
		this.getClients();
	}

	onSelect(client: Client) {
		this.selectedClient = client;
	}

	getClients() {
		this.clientService.getClients().then(clients => this.clients = clients);
	}

	gotoDetail(client: Client) {
		this.router.navigate(['/clients', client._id]);
	}

	delete(client: Client) {
		this.clientService
		.delete(client._id)
		.then(() => {
			this.clients = this.clients.filter(h => h !== client);
			if (this.selectedClient === client) { this.selectedClient = null; }
		});
	}

	add() {
		this.router.navigate(['/clients/new']);
	}
}
