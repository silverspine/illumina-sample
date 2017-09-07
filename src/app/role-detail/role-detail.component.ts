import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Location } from '@angular/common';
import 'rxjs/add/operator/switchMap';

import { Role } from '../models/role';
import { RoleService } from '../services/role.service';

@Component({
	selector: 'app-role-detail',
	templateUrl: './role-detail.component.html',
	styleUrls: ['./role-detail.component.css']
})

export class RoleDetailComponent implements OnInit {
	@Input() role: Role;

	constructor(
		private roleService: RoleService,
		private route: ActivatedRoute,
		private location: Location,
		private router: Router
	) {
		if(!localStorage.getItem('currentUser')){
			this.router.navigate(['/']);
		}
	}

	ngOnInit(): void {
		this.route.paramMap
		.switchMap((params: ParamMap) => {
			let id = params.get('id');
			if (id !== "new")
				return this.roleService.getRole(params.get('id'));
			else
				return Promise.resolve(new Role());
		})
		.subscribe(role => this.role = role);
	}

	goBack() {
		this.location.back();
	}

	save() {
		this.roleService.update(this.role)
		.then(() => this.goBack());
	}

	create(){
		this.roleService.create(this.role)
		.then(() => this.goBack());
	}
}
