import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';

import { AuthenticationService } from '../services/authentication.service';

@Injectable()
export class AuthGuard implements CanActivate {

	constructor(
		private router: Router,
		private authenticationService: AuthenticationService
		) { }

	canActivate() {
		if (localStorage.getItem('currentUser')) {
			const currentUser = JSON.parse(localStorage.getItem('currentUser'));
			if(!this.authenticationService.user){
				this.authenticationService.token = currentUser.token;
				this.authenticationService.user = currentUser.user;
			}
			return true;
		}

		// not logged in so redirect to login page
		this.router.navigate(['/login']);
		return false;
	}
}