import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map'

@Injectable()
export class AuthenticationService {
	private headers = new Headers({'Content-Type': 'application/json'});
	private authUrl = 'api/authenticate';
	public token: string;
	public user: any;

	constructor(private http: Http) {
		// set token if saved in local storage
		var currentUser = JSON.parse(localStorage.getItem('currentUser'));
		this.token = currentUser && currentUser.token;
	}

	login(username: string, password: string): Observable<boolean> {
		const url = `${this.authUrl}`;
		return this.http.post(url, JSON.stringify({ username: username, password: password }), {headers: this.headers})
			.map((response: Response) => {
				// login successful if there's a jwt token in the response
				let data = response.json() && response.json().data;
				if (Array.isArray(data) && data.length > 0) {
					let res = data[0];
					// set token property
					this.token = res.token;
					this.user = res.user;

					// store user and jwt token in local storage to keep user logged in between page refreshes
					localStorage.setItem('currentUser', JSON.stringify({ user: res.user, token: res.token }));

					// return true to indicate successful login
					return true;
				} else {
					// return false to indicate failed login
					return false;
				}
			});
	}

	logout(): void {
		// clear token remove user from local storage to log user out
		this.token = null;
		this.user = null;
		localStorage.removeItem('currentUser');
	}
}