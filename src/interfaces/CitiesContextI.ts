import { CityI } from "./CityI";

export interface CitiesContextI {
	cities: CityI[];
	isLoading: boolean;
	currentCity: CityI;
	getCity: (id: string) => void;
	createCity: (city: CityI) => void;
	deleteCity: (id: number) => void;
	error: string;
}
