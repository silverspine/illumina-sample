import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Role } from '../models/role';
import { RoleService } from '../services/role.service';

@Component({
	selector: 'app-roles',
	templateUrl: './roles.component.html',
	styleUrls: ['./roles.component.css']
})
export class RolesComponent implements OnInit {
	selectedRole: Role;
	roles: Role[];

	constructor(
		private router: Router,
		private roleService: RoleService
	) {
		if(!localStorage.getItem('currentUser')){
			this.router.navigate(['/']);
		}
	}

	ngOnInit() {
		this.getRoles();
	}

	onSelect(role: Role) {
		this.selectedRole = role;
	}

	getRoles() {
		this.roleService.getRoles().then(roles => this.roles = roles);
	}

	gotoDetail(role: Role) {
		this.router.navigate(['/roles', role._id]);
	}

	delete(role: Role) {
		this.roleService
		.delete(role._id)
		.then(() => {
			this.roles = this.roles.filter(h => h !== role);
			if (this.selectedRole === role) { this.selectedRole = null; }
		});
	}

	add() {
		this.router.navigate(['/roles/new']);
	}
}
