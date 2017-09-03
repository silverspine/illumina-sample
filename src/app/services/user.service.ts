import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/toPromise';

import { User } from '../models/user';

@Injectable()
export class UserService {
	private usersUrl = 'api/users';
	private headers = new Headers({'Content-Type': 'application/json'});

	constructor(private http: Http) { }


	private handleError(error: any): Promise<any> {
		return Promise.reject(error.message || error);
	}

	getUsers(): Promise<User[]>  {
		return this.http.get(this.usersUrl)
		.toPromise()
		.then(response => response.json().data as User[])
		.catch(this.handleError);
	}

	getUser(id: string): Promise<User> {
		const url = `${this.usersUrl}/${id}`;
		return this.http.get(url)
		.toPromise()
		.then(response => response.json().data as User)
		.catch(this.handleError);
	}
	
	update(user: User): Promise<User> {
		const url = `${this.usersUrl}/${user._id}`;
		return this.http
		.put(url, JSON.stringify(user), {headers: this.headers})
		.toPromise()
		.then(() => user)
		.catch(this.handleError);
	}

	delete(id: string): Promise<void> {
		const url = `${this.usersUrl}/${id}`;
		return this.http.delete(url, {headers: this.headers})
		.toPromise()
		.then(() => null)
		.catch(this.handleError);
	}

	create(user: User): Promise<User> {
		const url = `${this.usersUrl}`;
		return this.http
		.post(url, JSON.stringify(user), {headers: this.headers})
		.toPromise()
		.then(() => user)
		.catch(this.handleError);
	}
}