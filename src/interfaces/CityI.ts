export interface CityI {
	cityName: string;
	country: string;
	emoji: string;
	date: string;
	notes: string;
	position: {
		lat: number;
		lng: number;
	};
	id?: number;
}
