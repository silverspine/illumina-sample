import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule }   from '@angular/forms';
import { AppComponent } from './app.component';
import { HttpModule } from '@angular/http';

import { AppRoutingModule } from './app-routing.module';

import { TypeService } from './type.service';
import { UserService } from './user.service';
import { ClientService } from './client.service';

import { ClientsComponent } from './clients/clients.component';
import { ClientDetailComponent } from './client-detail/client-detail.component';
import { UsersComponent } from './users/users.component';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { TypesComponent } from './types/types.component';
import { TypeDetailComponent } from './type-detail/type-detail.component';
import { LoginComponent } from './login/login.component';

@NgModule({
	declarations: [
		AppComponent,
		ClientsComponent,
		ClientDetailComponent,
		UsersComponent,
		UserDetailComponent,
		TypesComponent,
		TypeDetailComponent,
		LoginComponent
	],
	imports: [
		BrowserModule,
		HttpModule,
		AppRoutingModule,
		FormsModule
	],
	providers: [
		TypeService,
		UserService,
		ClientService
	],
	bootstrap: [AppComponent]
})
export class AppModule { }