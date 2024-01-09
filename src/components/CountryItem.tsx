import { CountryI } from "../interfaces/CountryI";
import styles from "./CountryItem.module.css";

function CountryItem({ country }: { country: CountryI }) {
	return (
		<li className={styles.countryItem}>
			<span>{country.emoji}</span>
			<span>{country.country}</span>
		</li>
	);
}

export default CountryItem;
