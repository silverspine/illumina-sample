import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Location } from '@angular/common';
import 'rxjs/add/operator/switchMap';

import { Client } from '../client';
import { ClientService } from '../client.service';

@Component({
	selector: 'app-client-detail',
	templateUrl: './client-detail.component.html',
	styleUrls: ['./client-detail.component.css']
})

export class ClientDetailComponent implements OnInit {
	@Input() client: Client;

	constructor(
		private clientService: ClientService,
		private route: ActivatedRoute,
		private location: Location
		) { }

	ngOnInit(): void {
		this.route.paramMap
		.switchMap((params: ParamMap) => {
			let id = params.get('id');
			if (id !== "new")
				return this.clientService.getClient(params.get('id'));
			else
				return Promise.resolve(new Client());
		})
		.subscribe(client => this.client = client);
	}

	goBack() {
		this.location.back();
	}

	save() {
		this.clientService.update(this.client)
		.then(() => this.goBack());
	}

	create(){
		this.clientService.create(this.client)
		.then(() => this.goBack());
	}
}
