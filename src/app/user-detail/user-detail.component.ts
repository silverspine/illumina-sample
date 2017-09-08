import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Location } from '@angular/common';
import 'rxjs/add/operator/switchMap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as _ from "lodash";

import { User } from '../models/user';
import { UserService } from '../services/user.service';
import { Role } from '../models/role';
import { RoleService } from '../services/role.service';
import { AuthenticationService } from '../services/authentication.service';

@Component({
	selector: 'app-user-detail',
	templateUrl: './user-detail.component.html',
	styleUrls: ['./user-detail.component.css']
})

export class UserDetailComponent implements OnInit {
	currentUser: User;
	user: User;
	roles: Role[];
	userForm: FormGroup;

	constructor(
		private userService: UserService,
		private roleService: RoleService,
		private route: ActivatedRoute,
		private location: Location,
		private router: Router,
		private fb: FormBuilder,
		private authenticationService:AuthenticationService
		) {
		this.createForm();
	}

	createForm() {
		this.userForm = this.fb.group({
			username: ['', [
				Validators.required,
				Validators.minLength(3),
				Validators.maxLength(25)
			]],
			password: ['', [
				Validators.required,
				Validators.minLength(3),
				Validators.maxLength(40)
			]],
			role: ['', [
				Validators.required
			]],
			image: ['']
		});
	}

	ngOnInit(): void {
		this.currentUser = this.authenticationService.user;
		if(this.currentUser.role.name !== 'admin' ){
			this.router.navigate(['/']);
		}
		this.roleService.getRoles()
		.then(roles => this.roles = roles)
		.then( () => {
			this.route.paramMap
			.switchMap((params: ParamMap) => {
				let id = params.get('id');
				if (id !== "new")
					return this.userService.getUser(params.get('id'));
				else{
					let newUser = new User();
					newUser.role = _.find(this.roles, { 'name': 'user'});
					if(!newUser.role)
						newUser.role = _.find(this.roles, { 'name': 'admin'});
					return Promise.resolve(newUser);
				}
			})
			.subscribe(user => {
				this.user = user;
				this.user.role = _.find(this.roles, { 'name': user.role.name});
				this.userForm.setValue({
					username: this.user.username || '',
					password: this.user.password || '',
					role: _.find(this.roles, { 'name': user.role.name}) || '',
					image: this.user.image || ''
				});
			});
		});
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

	onSubmit() {
		this.user = this.prepareSaveUser();
		if(this.user._id){
			this.save();
		}
		else{
			this.create();
		}
	}

	prepareSaveUser(): User {
		const formModel = this.userForm.value;

		const saveUser: User = {
			_id: this.user._id,
			username: formModel.username as string,
			password: formModel.password as string,
			role: formModel.role as Role,
			image: formModel.image as string
		};

		return saveUser;
	}
}
