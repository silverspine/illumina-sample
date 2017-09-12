import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Location } from '@angular/common';
import 'rxjs/add/operator/switchMap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as _ from "lodash";
import { FileUploader } from 'ng2-file-upload/ng2-file-upload';

import { User } from '../models/user';
import { UserService } from '../services/user.service';
import { Role } from '../models/role';
import { RoleService } from '../services/role.service';
import { AuthenticationService } from '../services/authentication.service';
import { ImageService } from '../services/image.service';

@Component({
	selector: 'app-user-detail',
	templateUrl: './user-detail.component.html',
	styleUrls: ['./user-detail.component.css']
})

export class UserDetailComponent implements OnInit {
	currentUser: User;
	user: User;
	roles: Role[];
	private userForm: FormGroup;
	private uploader:FileUploader;
	private tmpImage:string;
	private preTmpImage:string;
	private previousImage:string;

	constructor(
		private userService: UserService,
		private roleService: RoleService,
		private route: ActivatedRoute,
		private location: Location,
		private router: Router,
		private fb: FormBuilder,
		private authenticationService:AuthenticationService,
		private imageService: ImageService
		) {
		this.createForm();
		this.uploader = new FileUploader({url: this.imageService.imagesUrl, itemAlias: 'image'})
	}

	createForm(): void {
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
				this.previousImage = this.user.image;
				this.userForm.setValue({
					username: this.user.username || '',
					password: this.user.password || '',
					role: _.find(this.roles, { 'name': user.role.name}) || '',
					image: this.user.image || ''
				});
			});
		});

		/**
		 * ng2-uploader
		 */
		// override the onAfterAddingfile property of the uploader so it doesn't authenticate with //credentials.
		this.uploader.onAfterAddingFile = (file)=> { file.withCredentials = false; };

		this.uploader.onCompleteItem = (item:any, response:any, status:any, headers:any) => {
			this.changeImage(JSON.parse(response).data);
		};
	}

	goBack(): void {
		this.preTmpImage = this.tmpImage;
		this.deletePreviousImage();
		this.location.back();
	}

	save(): void {
		this.userService.update(this.user)
		.then(() => this.location.back());
	}

	create(): void {
		this.userService.create(this.user)
		.then(() => this.location.back());
	}

	onSubmit(): void {
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
		if(this.tmpImage){
			this.preTmpImage = this.previousImage;
			this.deletePreviousImage();
		}

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

	selectedImage(event: any): void {
		let spinnerIcon = _.first(document.getElementsByClassName('fa'));
		if(spinnerIcon)
			spinnerIcon.classList.remove("hide");
		if(event.target.files.length > 0) {
			this.uploader.uploadAll();
		}
	}

	changeImage(data: any): void {
		this.preTmpImage = this.tmpImage;
		this.tmpImage = data;
		this.userForm.value.image = this.tmpImage;
		this.user.image = this.tmpImage;

		this.deletePreviousImage();
		let imageElemen = document.getElementById('image');
		let spinnerIcon = _.first(document.getElementsByClassName('fa'));
		if(spinnerIcon)
			spinnerIcon.classList.add("hide");
		let imageField = this.userForm.get('image');
		imageElemen.setAttribute('src', this.tmpImage);
		imageField.setValue(this.user.image);
		imageField.markAsDirty();
	}

	deletePreviousImage(): void {
		if(this.preTmpImage){
			try{
				let preTmpImageName = _.last(this.preTmpImage.split('/'));
				this.imageService.delete(preTmpImageName);
				this.preTmpImage = null;
			}catch(err){}
		}
	}
}
