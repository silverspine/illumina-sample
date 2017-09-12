import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Location } from '@angular/common';
import 'rxjs/add/operator/switchMap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as _ from "lodash";

import { Client } from '../models/client';
import { ClientService } from '../services/client.service';

@Component({
	selector: 'app-client-detail',
	templateUrl: './client-detail.component.html',
	styleUrls: ['./client-detail.component.css']
})

export class ClientDetailComponent implements OnInit {
	client: Client;
	clientForm: FormGroup;

	constructor(
		private clientService: ClientService,
		private route: ActivatedRoute,
		private location: Location,
		private router: Router,
		private fb: FormBuilder
		) {
		if(!localStorage.getItem('currentUser')){
			this.router.navigate(['/']);
		}
		this.createForm();
	}

	createForm() {
		let formats = "(999)999-9999|999-999-9999|9999999999";
		let exp = RegExp("^(" +
			formats
			.replace(/([\(\)])/g, "\\$1")
			.replace(/9/g,"\\d") +
			")$");

		this.clientForm = this.fb.group({
			name: ['', [
				Validators.required,
				Validators.minLength(3),
				Validators.maxLength(25)
			]],
			phone: ['', [
				Validators.required,
				Validators.pattern(exp)
			]],
			married: [false],
			male: [true],
			age: ['',[
				Validators.required
			]],
			profession: ['', [
				Validators.required,
				Validators.minLength(3),
				Validators.maxLength(25)
			]]
		});
	}

	get name() { return this.clientForm.get('name'); }
	get phone() { return this.clientForm.get('phone'); }
	get age() { return this.clientForm.get('age'); }
	get profession() { return this.clientForm.get('profession'); }

	ngOnInit(): void {
		this.route.paramMap
		.switchMap((params: ParamMap) => {
			let id = params.get('id');
			if (id !== "new")
				return this.clientService.getClient(params.get('id'));
			else
				return Promise.resolve(new Client());
		})
		.subscribe(client => {
			this.client = client;
			this.clientForm.setValue({
				name: this.client.name || '',
				phone: this.client.phone || '',
				married: this.client.married || false,
				male: this.client.male || true,
				age: this.client.age || '',
				profession: this.client.profession || ''
			});
		});
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

	onSubmit() {
		_.each(this.clientForm.controls, (elem) => {elem.markAsTouched()})

		if(!this.clientForm.valid)
			return;

		this.client = this.prepareSaveClient();
		if(this.client._id){
			this.save();
		}
		else{
			this.create();
		}
	}

	prepareSaveClient(): Client {
		const formModel = this.clientForm.value;

		const saveClient: Client = {
			_id: this.client._id,
			name: formModel.name as string,
			phone: formModel.phone as string,
			married: formModel.married as boolean,
			male: formModel.male as boolean,
			age: formModel.age as number,
			profession: formModel.profession as string,
		};
		return saveClient;
	}
}
