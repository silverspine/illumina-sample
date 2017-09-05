import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/toPromise';

import { Type } from '../models/type';

@Injectable()
export class TypeService {
	private typesUrl = 'api/types';
	private headers = new Headers({'Content-Type': 'application/json'});

	constructor(private http: Http) {}


	private handleError(error: any): Promise<any> {
		return Promise.reject(error.message || error);
	}

	getTypes(): Promise<Type[]>  {
		if(localStorage.getItem('currentUser'))
			this.headers.set('x-access-token', JSON.parse(localStorage.getItem('currentUser')).token);
		return this.http
		.get(this.typesUrl, {headers: this.headers})
		.toPromise()
		.then(response => response.json().data as Type[])
		.catch(this.handleError);
	}

	getType(id: string): Promise<Type> {
		const url = `${this.typesUrl}/${id}`;
		if(localStorage.getItem('currentUser'))
			this.headers.set('x-access-token', JSON.parse(localStorage.getItem('currentUser')).token);
		return this.http
		.get(url, {headers: this.headers})
		.toPromise()
		.then(response => response.json().data as Type)
		.catch(this.handleError);
	}

	update(type: Type): Promise<Type> {
		const url = `${this.typesUrl}/${type._id}`;
		if(localStorage.getItem('currentUser'))
			this.headers.set('x-access-token', JSON.parse(localStorage.getItem('currentUser')).token);
		return this.http
		.put(url, JSON.stringify(type), {headers: this.headers})
		.toPromise()
		.then(() => type)
		.catch(this.handleError);
	}

	delete(id: string): Promise<void> {
		const url = `${this.typesUrl}/${id}`;
		if(localStorage.getItem('currentUser'))
			this.headers.set('x-access-token', JSON.parse(localStorage.getItem('currentUser')).token);
		return this.http.delete(url, {headers: this.headers})
		.toPromise()
		.then(() => null)
		.catch(this.handleError);
	}

	create(type: Type): Promise<Type> {
		const url = `${this.typesUrl}`;
		if(localStorage.getItem('currentUser'))
			this.headers.set('x-access-token', JSON.parse(localStorage.getItem('currentUser')).token);
		return this.http
		.post(url, JSON.stringify(type), {headers: this.headers})
		.toPromise()
		.then(() => type)
		.catch(this.handleError);
	}
}