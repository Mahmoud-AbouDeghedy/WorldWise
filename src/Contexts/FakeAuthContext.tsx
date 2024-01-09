/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useReducer } from "react";
import { FakeAuthContextI } from "../interfaces/FakeAuthContextI";
import { UserI } from "../interfaces/UserI";

const AuthContext = createContext<FakeAuthContextI>({
	user: {
		name: "",
		email: "",
		password: "",
		avatar: "",
	},
	isAuthenticated: false,
	login: () => {},
	logout: () => {},
});

const initialState = {
	user: null,
	isAuthenticated: false,
};

function reducer(
	state: { user: UserI; isAuthenticated: boolean },
	action: { type: string; payload?: any }
) {
	switch (action.type) {
		case "login":
			return {
				...state,
				user: action.payload,
				isAuthenticated: true,
			};
		case "logout":
			return {
				...state,
				user: null,
				isAuthenticated: false,
			};
		default:
			throw new Error(`Invalid action type: ${action.type}`);
	}
}

const FAKE_USER = {
	name: "Jack",
	email: "jack@example.com",
	password: "qwerty",
	avatar: "https://i.pravatar.cc/100?u=zz",
};

function AuthProvider({ children }: { children: JSX.Element }) {
	const [{ user, isAuthenticated }, dispatch] = useReducer(
		reducer,
		initialState
	);

	function login(email: string, password: string) {
		if (email === FAKE_USER.email && password === FAKE_USER.password)
			dispatch({ type: "login", payload: FAKE_USER });
	}

	function logout() {
		dispatch({ type: "logout" });
	}

	return (
		<AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
			{children}
		</AuthContext.Provider>
	);
}

function useAuth() {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
}

export { AuthProvider, useAuth };
