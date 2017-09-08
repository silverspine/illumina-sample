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
		component: RolesComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'roles/:id',
		component: RoleDetailComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'roles/new',
		component: RoleDetailComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'users',
		component: UsersComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'users/:id',
		component: UserDetailComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'users/:new',
		component: UserDetailComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'clients',
		component: ClientsComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'clients/:id',
		component: ClientDetailComponent,
		canActivate: [AuthGuard]
	},
	{
		path: 'clients/new',
		component: ClientDetailComponent,
		canActivate: [AuthGuard]
	}
];

@NgModule({
	imports: [ RouterModule.forRoot(routes) ],
	exports: [ RouterModule ]
})

export class AppRoutingModule {}