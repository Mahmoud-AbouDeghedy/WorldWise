import { useNavigate } from "react-router-dom";
import {
	MapContainer,
	TileLayer,
	Marker,
	Popup,
	useMap,
	useMapEvents,
} from "react-leaflet";
import styles from "./Map.module.css";
import { useEffect, useState } from "react";
import { LatLngTuple } from "leaflet";
import { useCities } from "../Contexts/CitiesContext";
import { CityI } from "../interfaces/CityI";
import { useGeolocation } from "../hooks/useGeolocation";
import Button from "./Button";
import { useUrlPosition } from "../hooks/useUrlPosition";

export default function Map() {
	const { cities } = useCities();

	const [mapPosition, setMapPosition] = useState<LatLngTuple>([40, 0]);
	const { isLoading, position, getPosition } = useGeolocation();
	const [lat, lng] = useUrlPosition();

	useEffect(() => {
		setMapPosition([Number(lat) || 40, Number(lng) || 0]);
	}, [lat, lng]);

	useEffect(() => {
		if (position) {
			setMapPosition([position.lat, position.lng]);
		}
	}, [position]);

	return (
		<div className={styles.mapContainer}>
			{!position && (
				<Button type="position" onClick={getPosition}>
					{isLoading ? "Loading..." : "Use your position"}
				</Button>
			)}
			<MapContainer
				center={mapPosition}
				zoom={6}
				scrollWheelZoom={true}
				className={styles.map}
			>
				<TileLayer
					attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
					url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
				/>
				{cities.map((city: CityI) => (
					<Marker
						position={[city.position.lat, city.position.lng]}
						key={city.id}
					>
						<Popup>
							<span>{city.emoji}</span> <span>{city.cityName}</span>
						</Popup>
					</Marker>
				))}
				{lat && lng && <ChangeCenter position={mapPosition} />}
				<DetectClick />
			</MapContainer>
		</div>
	);
}

function ChangeCenter({ position }: { position: LatLngTuple }) {
	const map = useMap();
	map.setView(position);
	return null;
}

function DetectClick() {
	const navigate = useNavigate();
	useMapEvents({
		click: (e) => navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`),
	});
	return null;
}
