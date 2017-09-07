import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Location } from '@angular/common';
import 'rxjs/add/operator/switchMap';

import { User } from '../models/user';
import { UserService } from '../services/user.service';
import { Role } from '../models/role';
import { RoleService } from '../services/role.service';

@Component({
	selector: 'app-user-detail',
	templateUrl: './user-detail.component.html',
	styleUrls: ['./user-detail.component.css']
})

export class UserDetailComponent implements OnInit {
	@Input() user: User;
	roles: Role[];

	constructor(
		private userService: UserService,
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
		this.roleService.getRoles().then(roles => this.roles = roles);
		this.route.paramMap
		.switchMap((params: ParamMap) => {
			let id = params.get('id');
			if (id !== "new")
				return this.userService.getUser(params.get('id'));
			else{
				let newUser = new User();
				newUser.role = new Role();
				return Promise.resolve(newUser);
			}
		})
		.subscribe(user => this.user = user);
	}

	goBack() {
		this.location.back();
	}

	save() {
		this.userService.update(this.user)
		.then(() => this.goBack());
	}

	create(){
		this.userService.create(this.user)
		.then(() => this.goBack());
	}
}
