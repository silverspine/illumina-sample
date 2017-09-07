import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent }   from './login/login.component';
import { RolesComponent }      from './roles/roles.component';
import { RoleDetailComponent }  from './role-detail/role-detail.component';
import { UsersComponent }      from './users/users.component';
import { UserDetailComponent }  from './user-detail/user-detail.component';
import { ClientsComponent }      from './clients/clients.component';
import { ClientDetailComponent }  from './client-detail/client-detail.component';

import {AuthGuard} from './guards/auth.guard';

const routes: Routes = [
	{
		path: '',
		redirectTo: '/login',
		pathMatch: 'full',
		canActivate: [AuthGuard]
	},
	{
		path: 'login',
		component: LoginComponent
	},
	{
		path: 'roles',
		component: RolesComponent
	},
	{
		path: 'roles/:id',
		component: RoleDetailComponent
	},
	{
		path: 'roles/new',
		component: RoleDetailComponent
	},
	{
		path: 'users',
		component: UsersComponent
	},
	{
		path: 'users/:id',
		component: UserDetailComponent
	},
	{
		path: 'users/:new',
		component: UserDetailComponent
	},
	{
		path: 'clients',
		component: ClientsComponent
	},
	{
		path: 'clients/:id',
		component: ClientDetailComponent
	},
	{
		path: 'clients/new',
		component: ClientDetailComponent
	}
];

@NgModule({
	imports: [ RouterModule.forRoot(routes) ],
	exports: [ RouterModule ]
})

export class AppRoutingModule {}