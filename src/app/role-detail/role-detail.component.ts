import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Location } from '@angular/common';
import 'rxjs/add/operator/switchMap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Role } from '../models/role';
import { RoleService } from '../services/role.service';

@Component({
	selector: 'app-role-detail',
	templateUrl: './role-detail.component.html',
	styleUrls: ['./role-detail.component.css']
})

export class RoleDetailComponent implements OnInit {
	@Input() role: Role;
	roleForm: FormGroup;

	constructor(
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
		this.roleForm = this.fb.group({
			name: ['', [
				Validators.required,
				Validators.minLength(3),
				Validators.maxLength(25)
				]]
		});
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
		.subscribe(role => {
			this.role = role;
			this.roleForm.setValue({
				name: this.role.name || ''
			});
		});
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

	onSubmit() {
		this.role = this.prepareSaveRole();
		if(this.role._id){
			this.save();
		}
		else{
			this.create();
		}
	}

	prepareSaveRole(): Role {
		const formModel = this.roleForm.value;

		const saveRole: Role = {
			_id: this.role._id,
			name: formModel.name as string,
		};
		return saveRole;
	}
}
