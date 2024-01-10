/* eslint-disable react-refresh/only-export-components */
import {
	createContext,
	useEffect,
	useContext,
	useReducer,
	useCallback,
} from "react";
import { CitiesContextI } from "../interfaces/CitiesContextI";
import { CityI } from "../interfaces/CityI";

const CitiesContext = createContext<CitiesContextI>({
	cities: [],
	isLoading: false,
	currentCity: {
		cityName: "",
		emoji: "",
		date: "",
		notes: "",
		country: "",
		id: 1,
		position: {
			lat: 0,
			lng: 0,
		},
	},
	getCity: () => {},
	createCity: () => {},
	deleteCity: () => {},
	error: "",
});

// const BASE_URL = "http://localhost:8000";
const BASE_URL = "https://citiesdb.onrender.com";

const initialState = {
	cities: [],
	isLoading: false,
	currentCity: {
		cityName: "",
		emoji: "",
		date: "",
		notes: "",
		country: "",
		id: 1,
		position: {
			lat: 0,
			lng: 0,
		},
	},
	error: "",
};

function reducer(
	state: {
		cities: CityI[];
		isLoading: boolean;
		currentCity: CityI;
		error: string;
	},
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	action: { type: string; payload?: any }
) {
	switch (action.type) {
		case "loading":
			return {
				...state,
				isLoading: true,
			};
		case "cities/loaded":
			return {
				...state,
				cities: action.payload,
				isLoading: false,
			};
		case "city/loaded":
			return {
				...state,
				currentCity: action.payload,
				isLoading: false,
			};
		case "city/created":
			return {
				...state,
				isLoading: false,
				cities: [...state.cities, action.payload],
				currentCity: action.payload,
			};
		case "city/deleted":
			return {
				...state,
				isLoading: false,
				cities: state.cities.filter(
					(city: CityI) => city.id !== action.payload
				),
				currentCity: initialState.currentCity,
			};
		case "rejected":
			return {
				...state,
				error: action.payload,
				isLoading: false,
			};
		default:
			throw new Error(`Unrecognized action: ${action.type}`);
	}
}

function CitiesProvider({ children }: { children: JSX.Element }) {
	// const [cities, setCities] = useState<CityI[]>([]);
	// const [isLoading, setIsLoading] = useState(false);
	// const [currentCity, setCurrentCity] = useState<CityI>({
	// 	cityName: "",
	// 	emoji: "",
	// 	date: "",
	// 	notes: "",
	// 	country: "",
	// 	id: 1,
	// 	position: {
	// 		lat: 0,
	// 		lng: 0,
	// 	},
	// });

	const [{ cities, isLoading, currentCity, error }, dispatch] = useReducer(
		reducer,
		initialState
	);

	useEffect(function () {
		async function loadCities() {
			dispatch({ type: "loading" });
			try {
				const res = await fetch(BASE_URL + "/cities");
				const json = await res.json();
				dispatch({ type: "cities/loaded", payload: json });
			} catch (e) {
				dispatch({
					type: "rejected",
					payload: "There was an error loading cities...",
				});
				alert("There was an error loading cities...");
				console.log(e);
			}
		}
		loadCities();
	}, []);

	const getCity = useCallback(
		() =>
			async function getCity(id: string) {
				if (id === currentCity.id.toString()) return;
				dispatch({ type: "loading" });
				try {
					const res = await fetch(BASE_URL + "/cities/" + id);
					const json = await res.json();
					dispatch({ type: "city/loaded", payload: json });
				} catch (e) {
					dispatch({
						type: "rejected",
						payload: "There was an error loading the city...",
					});
					alert("There was an error loading the city...");
					console.log(e);
				}
			},
		[currentCity.id]
	);

	async function createCity(city: CityI) {
		dispatch({ type: "loading" });
		try {
			const res = await fetch(BASE_URL + "/cities", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(city),
			});
			const json = await res.json();
			dispatch({ type: "city/created", payload: json });
		} catch (e) {
			dispatch({
				type: "rejected",
				payload: "There was an error creating the city...",
			});
			alert("There was an error creating the city...");
			console.log(e);
		}
	}

	async function deleteCity(id: number) {
		dispatch({ type: "loading" });
		try {
			await fetch(BASE_URL + "/cities/" + id, {
				method: "DELETE",
			});
			dispatch({ type: "city/deleted", payload: id });
		} catch (e) {
			dispatch({
				type: "rejected",
				payload: "There was an error deleting the city...",
			});
			alert("There was an error deleting the city...");
			console.log(e);
		}
	}

	return (
		<CitiesContext.Provider
			value={{
				cities,
				isLoading,
				currentCity,
				getCity,
				createCity,
				deleteCity,
				error,
			}}
		>
			{children}
		</CitiesContext.Provider>
	);
}

function useCities() {
	const context = useContext(CitiesContext);
	if (!context) {
		throw new Error("useCities must be used within a CitiesProvider");
	}
	return context;
}

export { CitiesProvider, useCities };
