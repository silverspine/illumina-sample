///////////////////
//////////////// //
// User Model // //
//////////////// //
///////////////////
import { Role } from './role';

export class User {
	_id: string;
	username: string;
	password: string;
	role: Role;
	image: string;
}