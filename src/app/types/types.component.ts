import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Type } from '../models/type';
import { TypeService } from '../services/type.service';

@Component({
	selector: 'app-types',
	templateUrl: './types.component.html',
	styleUrls: ['../shared-styles/list-elements.css', './types.component.css']
})
export class TypesComponent implements OnInit {
	selectedType: Type;
	types: Type[];

	constructor(
		private router: Router,
		private typeService: TypeService
		) { }

	ngOnInit() {
		this.getTypes();
	}

	onSelect(type: Type) {
		this.selectedType = type;
	}

	getTypes() {
		this.typeService.getTypes().then(types => this.types = types);
	}

	gotoDetail(type: Type) {
		this.router.navigate(['/types', type._id]);
	}

	delete(type: Type) {
		this.typeService
		.delete(type._id)
		.then(() => {
			this.types = this.types.filter(h => h !== type);
			if (this.selectedType === type) { this.selectedType = null; }
		});
	}

	add() {
		this.router.navigate(['/types/new']);
	}
}
