import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Location } from '@angular/common';
import 'rxjs/add/operator/switchMap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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
	userForm: FormGroup;

	constructor(
		private userService: UserService,
		private roleService: RoleService,
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
					newUser.role = this.roles[0];
					return Promise.resolve(newUser);
				}
			})
			.subscribe(user => {
				this.user = user;
				this.userForm.setValue({
					username: this.user.username || '',
					password: this.user.password || '',
					role: this.user.role || this.roles[0],
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
