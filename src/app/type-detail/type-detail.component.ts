import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Location } from '@angular/common';
import 'rxjs/add/operator/switchMap';

import { Type } from '../models/type';
import { TypeService } from '../services/type.service';

@Component({
	selector: 'app-type-detail',
	templateUrl: './type-detail.component.html',
	styleUrls: ['./type-detail.component.css']
})

export class TypeDetailComponent implements OnInit {
	@Input() type: Type;

	constructor(
		private typeService: TypeService,
		private route: ActivatedRoute,
		private location: Location
		) { }

	ngOnInit(): void {
		this.route.paramMap
		.switchMap((params: ParamMap) => {
			let id = params.get('id');
			if (id !== "new")
				return this.typeService.getType(params.get('id'));
			else
				return Promise.resolve(new Type());
		})
		.subscribe(type => this.type = type);
	}

	goBack() {
		this.location.back();
	}

	save() {
		this.typeService.update(this.type)
		.then(() => this.goBack());
	}

	create(){
		this.typeService.create(this.type)
		.then(() => this.goBack());
	}
}
