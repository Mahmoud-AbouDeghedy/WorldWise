import { CityI } from "../interfaces/CityI";
import { CountryI } from "../interfaces/CountryI";
import styles from "./CountryList.module.css";
import CountryItem from "./CountryItem";
import Message from "./Message";
import Spinner from "./Spinner";
import { useCities } from "../Contexts/CitiesContext";

export default function CountryList() {
	const { cities, isLoading } = useCities();

	if (isLoading) {
		return <Spinner />;
	}

	if (!cities.length)
		return (
			<Message message="No cities to show, Add you first city by clicking on a city on the map" />
		);

	const countries = cities.reduce((arr: Array<CountryI>, city: CityI) => {
		if (!arr.map((el: CountryI) => el.country).includes(city.country)) {
			return [...arr, { country: city.cityName, emoji: city.emoji }];
		} else return arr;
	}, []);

	return (
		<ul className={styles.countriesList}>
			{countries.map((country: CountryI, idx) => (
				<CountryItem country={country} key={idx} />
			))}
		</ul>
	);
}
