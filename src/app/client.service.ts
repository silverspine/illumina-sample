import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/toPromise';

import { Client } from './client';

@Injectable()
export class ClientService {
	private clientsUrl = 'api/clients';
	private headers = new Headers({'Content-Type': 'application/json'});

	constructor(private http: Http) { }


	private handleError(error: any): Promise<any> {
		return Promise.reject(error.message || error);
	}

	getClients(): Promise<Client[]>  {
		return this.http.get(this.clientsUrl)
		.toPromise()
		.then(response => response.json().data as Client[])
		.catch(this.handleError);
	}

	getClient(id: string): Promise<Client> {
		const url = `${this.clientsUrl}/${id}`;
		return this.http.get(url)
		.toPromise()
		.then(response => response.json().data as Client)
		.catch(this.handleError);
	}

	update(client: Client): Promise<Client> {
		const url = `${this.clientsUrl}/${client._id}`;
		return this.http
		.put(url, JSON.stringify(client), {headers: this.headers})
		.toPromise()
		.then(() => client)
		.catch(this.handleError);
	}

	delete(id: string): Promise<void> {
		const url = `${this.clientsUrl}/${id}`;
		return this.http.delete(url, {headers: this.headers})
		.toPromise()
		.then(() => null)
		.catch(this.handleError);
	}

	create(client: Client): Promise<Client> {
		const url = `${this.clientsUrl}`;
		return this.http
		.post(url, JSON.stringify(client), {headers: this.headers})
		.toPromise()
		.then(() => client)
		.catch(this.handleError);
	}
}