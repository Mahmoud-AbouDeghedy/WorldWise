import { UserI } from "./UserI";

export interface FakeAuthContextI {
	isAuthenticated: boolean;
	user: UserI;
	login: (email: string, password: string) => void;
	logout: () => void;
}
