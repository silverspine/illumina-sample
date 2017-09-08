import { Component, AfterContentChecked } from '@angular/core';

import { AuthenticationService } from './services/authentication.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})

export class AppComponent implements AfterContentChecked{
	title = 'Illumina Sample';
	currentUser = null;

	constructor( private authenticationService: AuthenticationService ) {
	}

	ngAfterContentChecked(): void {
		this.currentUser = this.authenticationService.user;
	}

	printCurrentUser(): string {
		return JSON.stringify(this.currentUser);
	}
}
