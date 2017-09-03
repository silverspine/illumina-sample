import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent }   from './login/login.component';
import { TypesComponent }      from './types/types.component';
import { TypeDetailComponent }  from './type-detail/type-detail.component';
import { UsersComponent }      from './users/users.component';
import { UserDetailComponent }  from './user-detail/user-detail.component';
import { ClientsComponent }      from './clients/clients.component';
import { ClientDetailComponent }  from './client-detail/client-detail.component';

const routes: Routes = [
	{
		path: '',
		redirectTo: '/login',
		pathMatch: 'full'
	},
	{
		path: 'login',
		component: LoginComponent
	},
	{
		path: 'types',
		component: TypesComponent
	},
	{
		path: 'types/:id',
		component: TypeDetailComponent
	},
	{
		path: 'types/new',
		component: TypeDetailComponent
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