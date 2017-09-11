import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/toPromise';

import { Role } from '../models/role';

@Injectable()
export class RoleService {
	private rolesUrl = 'api/roles';
	private headers = new Headers({'Content-Type': 'application/json'});

	constructor(private http: Http) {}


	private handleError(error: any): Promise<any> {
		return Promise.reject(error.message || error);
	}

	getRoles(): Promise<Role[]>  {
		if(localStorage.getItem('currentUser'))
			this.headers.set('x-access-token', JSON.parse(localStorage.getItem('currentUser')).token);
		return this.http
		.get(this.rolesUrl, {headers: this.headers})
		.toPromise()
		.then(response => response.json().data as Role[])
		.catch(this.handleError);
	}

	getRole(id: string): Promise<Role> {
		const url = `${this.rolesUrl}/${id}`;
		if(localStorage.getItem('currentUser'))
			this.headers.set('x-access-token', JSON.parse(localStorage.getItem('currentUser')).token);
		return this.http
		.get(url, {headers: this.headers})
		.toPromise()
		.then(response => response.json().data as Role)
		.catch(this.handleError);
	}

	update(role: Role): Promise<Role> {
		const url = `${this.rolesUrl}/${role._id}`;
		if(localStorage.getItem('currentUser'))
			this.headers.set('x-access-token', JSON.parse(localStorage.getItem('currentUser')).token);
		return this.http
		.put(url, JSON.stringify(role), {headers: this.headers})
		.toPromise()
		.then(() => role)
		.catch(this.handleError);
	}

	delete(id: string): Promise<void> {
		const url = `${this.rolesUrl}/${id}`;
		if(localStorage.getItem('currentUser'))
			this.headers.set('x-access-token', JSON.parse(localStorage.getItem('currentUser')).token);
		return this.http.delete(url, {headers: this.headers})
		.toPromise()
		.then(() => null)
		.catch(this.handleError);
	}

	create(role: Role): Promise<Role> {
		const url = `${this.rolesUrl}`;
		if(localStorage.getItem('currentUser'))
			this.headers.set('x-access-token', JSON.parse(localStorage.getItem('currentUser')).token);
		JSON.stringify(role)
		return this.http
		.post(url, JSON.stringify(role), {headers: this.headers})
		.toPromise()
		.then(() => role)
		.catch(this.handleError);
	}
}