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
		this.roleService.getRoles()
		.then(roles => this.roles = roles)
		.catch( () => this.roles = [this.currentUser.role])
		.then( () => {
			this.route.paramMap
			.switchMap((params: ParamMap) => {
				let id = params.get('id');
				if (id !== "new" && (this.currentUser._id === id || this.currentUser.role.name === 'admin')){
					return this.userService.getUser(params.get('id'));
				}
				else if(this.currentUser.role.name === 'admin') {
					let newUser = new User();
					newUser.role = _.find(this.roles, { 'name': 'user'});
					if(!newUser.role)
						newUser.role = _.find(this.roles, { 'name': 'admin'});
					return Promise.resolve(newUser);
				}else{
					this.router.navigate(['/']);
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
			image: formModel.image as string,
			modifiedPassword: this.userForm.controls['password'].dirty as boolean
		};

		return saveUser;
	}

	public changeImage(event: any) {
		if(event.target.files.length > 0) {
			let imageField = this.userForm.get('image');
			let file = event.target.files[0];
			let reader: FileReader = new FileReader();
			let tagImage = document.getElementById('image');

			reader.onloadend = (e: any) => {
				this.user.image = reader.result;
				imageField.setValue({image: reader.result});
				imageField.markAsDirty();
			}
			file.load = (e: any) => {
				tagImage.setAttribute('src', reader.result);
			}
			reader.readAsDataURL(file);
		}
	}
}
