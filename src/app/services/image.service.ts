import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class ImageService {
	public imagesUrl = 'api/images';
	private headers = new Headers();

	constructor(private http: Http) {}


	private handleError(error: any): Promise<any> {
		return Promise.reject(error.message || error);
	}

	delete(name: string): Promise<void> {
		const url = `${this.imagesUrl}/${name}`;
		if(localStorage.getItem('currentUser'))
			this.headers.set('x-access-token', JSON.parse(localStorage.getItem('currentUser')).token);
		return this.http.delete(url, {headers: this.headers})
		.toPromise()
		.then(() => null)
		.catch(this.handleError);
	}
}