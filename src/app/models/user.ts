///////////////////
//////////////// //
// User Model // //
//////////////// //
///////////////////
import { Type } from './type';

export class User {
	_id: string;
	username: string;
	password: string;
	type: Type;
	image: string;
}