import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Location } from '@angular/common';
import 'rxjs/add/operator/switchMap';

import { User } from '../models/user';
import { UserService } from '../services/user.service';
import { Type } from '../models/type';
import { TypeService } from '../services/type.service';

@Component({
	selector: 'app-user-detail',
	templateUrl: './user-detail.component.html',
	styleUrls: ['./user-detail.component.css']
})

export class UserDetailComponent implements OnInit {
	@Input() user: User;
	types: Type[];

	constructor(
		private userService: UserService,
		private typeService: TypeService,
		private route: ActivatedRoute,
		private location: Location
		) { }

	ngOnInit(): void {
		this.typeService.getTypes().then(types => this.types = types);
		this.route.paramMap
		.switchMap((params: ParamMap) => {
			let id = params.get('id');
			if (id !== "new")
				return this.userService.getUser(params.get('id'));
			else{
				let newUser = new User();
				newUser.type = new Type();
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
