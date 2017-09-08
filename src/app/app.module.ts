import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { HttpModule } from '@angular/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app-routing.module';

import { RoleService } from './services/role.service';
import { UserService } from './services/user.service';
import { ClientService } from './services/client.service';
import { AuthGuard } from './guards/auth.guard';
import { AuthenticationService } from './services/authentication.service';

import { ClientsComponent } from './clients/clients.component';
import { ClientDetailComponent } from './client-detail/client-detail.component';
import { UsersComponent } from './users/users.component';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { RolesComponent } from './roles/roles.component';
import { RoleDetailComponent } from './role-detail/role-detail.component';
import { LoginComponent } from './login/login.component';

@NgModule({
	declarations: [
		AppComponent,
		ClientsComponent,
		ClientDetailComponent,
		UsersComponent,
		UserDetailComponent,
		RolesComponent,
		RoleDetailComponent,
		LoginComponent
	],
	imports: [
		NgbModule.forRoot(),
		BrowserModule,
		HttpModule,
		AppRoutingModule,
		FormsModule,
		ReactiveFormsModule
	],
	providers: [
		RoleService,
		UserService,
		ClientService,
		AuthGuard,
		AuthenticationService
	],
	bootstrap: [AppComponent]
})
export class AppModule { }