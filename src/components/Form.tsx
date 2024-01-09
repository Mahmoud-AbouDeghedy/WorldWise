/* eslint-disable react-refresh/only-export-components */
// "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"

import { useState, useEffect } from "react";

import styles from "./Form.module.css";
import Button from "./Button";
import BackButton from "./BackButton";
import { useUrlPosition } from "../hooks/useUrlPosition";
import Message from "./Message";
import Spinner from "./Spinner";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useCities } from "../Contexts/CitiesContext";
import { useNavigate } from "react-router-dom";

export function convertToEmoji(countryCode: string) {
	const codePoints = countryCode
		.toUpperCase()
		.split("")
		.map((char) => 127397 + char.charCodeAt(0));
	console.log(codePoints);
	return String.fromCodePoint(...codePoints);
}

const BASE_URL = "https://api.bigdatacloud.net/data/reverse-geocode-client";

function Form() {
	const [cityName, setCityName] = useState("");
	const [country, setCountry] = useState("");
	const [date, setDate] = useState(new Date());
	const [notes, setNotes] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [emoji, setEmoji] = useState("");
	const [geoCodingError, setGeoCodingError] = useState("");
	const [lat, lng] = useUrlPosition();
	const { createCity, isLoading: isLoadingContext } = useCities();
	const navigate = useNavigate();

	useEffect(() => {
		if (!lat || !lng) return;
		async function fetchCityData() {
			try {
				setIsLoading(true);
				setGeoCodingError("");
				const res = await fetch(
					`${BASE_URL}?latitude=${lat}&longitude=${lng}&localityLanguage=en`
				);
				const data = await res.json();
				console.log(data);
				if (!data.countryCode)
					throw new Error(
						"That doesn't seem to be a city. Click somewhere else 🙃"
					);
				setCityName(data.city || data.locality || "");
				setCountry(data.countryName || "");
				setEmoji(convertToEmoji(data.countryCode || ""));
			} catch (err: unknown) {
				if (err instanceof Error) setGeoCodingError(err.message);
			} finally {
				setIsLoading(false);
			}
		}
		fetchCityData();
	}, [lat, lng]);

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		if (!cityName || !country || !date || !lat || !lng) return;
		const newCity = {
			cityName,
			country,
			date: date.toISOString(),
			notes,
			position: { lat: +lat, lng: +lng },
			emoji,
		};
		await createCity(newCity);
		navigate("/app/cities");
	}

	if (isLoading) return <Spinner />;
	if (!lat || !lng)
		return <Message message="Click somewhere on the map to add a city" />;
	if (geoCodingError) {
		console.log(geoCodingError);
		return <Message message={geoCodingError} />;
	}

	return (
		<form
			className={`${styles.form} ${isLoadingContext ? styles.loading : ""}`}
			onSubmit={handleSubmit}
		>
			<div className={styles.row}>
				<label htmlFor="cityName">City name</label>
				<input
					id="cityName"
					onChange={(e) => setCityName(e.target.value)}
					value={cityName}
				/>
				<span className={styles.flag}>{emoji}</span>
			</div>

			<div className={styles.row}>
				<label htmlFor="date">When did you go to {cityName}?</label>

				<DatePicker
					id="date"
					onChange={(date) => setDate(date!)}
					selected={date}
					dateFormat="dd/MM/yyyy"
				/>
			</div>

			<div className={styles.row}>
				<label htmlFor="notes">Notes about your trip to {cityName}</label>
				<textarea
					id="notes"
					onChange={(e) => setNotes(e.target.value)}
					value={notes}
				/>
			</div>

			<div className={styles.buttons}>
				<Button type="primary">Add</Button>
				<BackButton />
			</div>
		</form>
	);
}

export default Form;
