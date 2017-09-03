import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { User } from '../user';
import { UserService } from '../user.service';

@Component({
	selector: 'app-users',
	templateUrl: './users.component.html',
	styleUrls: ['../shared-styles/list-elements.css', './users.component.css']
})
export class UsersComponent implements OnInit {
	selectedUser: User;
	users: User[];

	constructor(
		private router: Router,
		private userService: UserService
	) { }

	ngOnInit() {
		this.getUsers();
	}

	onSelect(user: User) {
		this.selectedUser = user;
	}

	getUsers() {
		this.userService.getUsers().then(users => this.users = users);
	}

	gotoDetail(user: User) {
		this.router.navigate(['/users', user._id]);
	}

	delete(user: User) {
		this.userService
		.delete(user._id)
		.then(() => {
			this.users = this.users.filter(h => h !== user);
			if (this.selectedUser === user) { this.selectedUser = null; }
		});
	}

	add() {
		this.router.navigate(['/users/new']);
	}
}
