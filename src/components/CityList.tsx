import { useCities } from "../Contexts/CitiesContext";
import { CityI } from "../interfaces/CityI";
import CityItem from "./CityItem";
import styles from "./CityList.module.css";
import Message from "./Message";
import Spinner from "./Spinner";

export default function CityList() {
	const { cities, isLoading } = useCities();

	if (isLoading) {
		return <Spinner />;
	}

	if (!cities.length)
		return (
			<Message message="No cities to show, Add you first city by clicking on a city on the map" />
		);

	return (
		<ul className={styles.cityList}>
			{cities.map((city: CityI) => (
				<CityItem city={city} key={city.id} />
			))}
		</ul>
	);
}
