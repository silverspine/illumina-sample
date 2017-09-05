import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/toPromise';

import { AuthenticationService } from '../services/authentication.service';
import { User } from '../models/user';

@Injectable()
export class UserService {
	private usersUrl = 'api/users';
	private headers = new Headers({'Content-Type': 'application/json'});

	constructor(private http: Http) {}


	private handleError(error: any): Promise<any> {
		return Promise.reject(error.message || error);
	}

	getUsers(): Promise<User[]>  {
		if(localStorage.getItem('currentUser'))
			this.headers.set('x-access-token', JSON.parse(localStorage.getItem('currentUser')).token);
		return this.http
		.get(this.usersUrl, {headers: this.headers})
		.toPromise()
		.then(response => response.json().data as User[])
		.catch(this.handleError);
	}

	getUser(id: string): Promise<User> {
		const url = `${this.usersUrl}/${id}`;
		if(localStorage.getItem('currentUser'))
			this.headers.set('x-access-token', JSON.parse(localStorage.getItem('currentUser')).token);
		return this.http
		.get(url, {headers: this.headers})
		.toPromise()
		.then(response => response.json().data as User)
		.catch(this.handleError);
	}
	
	update(user: User): Promise<User> {
		const url = `${this.usersUrl}/${user._id}`;
		if(localStorage.getItem('currentUser'))
			this.headers.set('x-access-token', JSON.parse(localStorage.getItem('currentUser')).token);
		return this.http
		.put(url, JSON.stringify(user), {headers: this.headers})
		.toPromise()
		.then(() => user)
		.catch(this.handleError);
	}

	delete(id: string): Promise<void> {
		const url = `${this.usersUrl}/${id}`;
		if(localStorage.getItem('currentUser'))
			this.headers.set('x-access-token', JSON.parse(localStorage.getItem('currentUser')).token);
		return this.http.delete(url, {headers: this.headers})
		.toPromise()
		.then(() => null)
		.catch(this.handleError);
	}

	create(user: User): Promise<User> {
		const url = `${this.usersUrl}`;
		if(localStorage.getItem('currentUser'))
			this.headers.set('x-access-token', JSON.parse(localStorage.getItem('currentUser')).token);
		return this.http
		.post(url, JSON.stringify(user), {headers: this.headers})
		.toPromise()
		.then(() => user)
		.catch(this.handleError);
	}
}