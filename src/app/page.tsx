/* Inside your React component file */
'use client'
import { useEffect, useState } from 'react';
import styles from './page.module.css';
import {CloudSun, CloudFog} from "@phosphor-icons/react";

interface WeatherData {
	main: {
		temp: number
	}
	weather: {
		description: string
	}[]
	name: string
	// Add other necessary properties
}

function getCurrentDate() {
	const currentDate = new Date()
	const options = { month: 'long' } as Intl.DateTimeFormatOptions
	const monthName = currentDate.toLocaleString('pt-br', options)
	const date = new Date().getDate() + ', ' + monthName
	return date
}

export default function Home() {
	const date = getCurrentDate()
	const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
	const [city, setCity] = useState('recife')

	async function fetchData(cityName: string): Promise<void> {
		try {
			const response = await fetch('/api/weather?address=' + cityName)
			const jsonData: { data: WeatherData } = await response.json()
			setWeatherData(jsonData.data)
		} catch (error) {
			console.error('Error fetching data:', error)
		}
	}

	async function fetchDataByCoordinates(
		latitude: number,
		longitude: number,
	): Promise<void> {
		try {
			const response = await fetch(
				`/api/weather?lat=${latitude}&lon=${longitude}`,
			)
			const jsonData: { data: WeatherData } = await response.json()
			setWeatherData(jsonData.data)
		} catch (error) {
			console.error('Error fetching data:', error)
		}
	}

	useEffect(() => {
		if ('geolocation' in navigator) {
			navigator.geolocation.getCurrentPosition(
				(position) => {
					const { latitude, longitude } = position.coords
					fetchDataByCoordinates(latitude, longitude)
				},
				(error) => {
					console.error('Error getting geolocation:', error)
				},
			)
		}
	}, [])

	return (
		<main className={styles.main}>
			<article className={styles.widget}>
				<div className="components">
					<form
						className={styles.weatherLocation}
						onSubmit={(e) => {
							e.preventDefault()
							fetchData(city)
						}}
					>
						<input
							className={styles.input_field}
							placeholder="Nome Da Cidade"
							type="text"
							id="cityName"
							name="cityName"
							onChange={(e) => setCity(e.target.value)}
						/>
						<button className={styles.search_button} type="submit">
							Search
						</button>
					</form>
					{weatherData && weatherData.weather && weatherData.weather[0] ? (
						<>
							<div className={styles.icon_and_weatherInfo}>
								<div className={styles.weatherIcon}>
									{weatherData?.weather[0]?.description === 'nublado'? <CloudSun size={32} /> : null ||
                  weatherData?.weather[0]?.description === 'nuvens dispersas'?
                  <CloudFog size={32} /> : null 
									/*  ? (
										<i
											className={`wi wi-day-${weatherData?.weather[0]?.description}`}
										></i>
									) : (
										<CloudSun size={32} />
									) */}
								</div>
								<div className={styles.weatherInfo}>
									<div className={styles.temperature}>
										<span>
											{(weatherData?.main?.temp - 273.5).toFixed(1) +
												String.fromCharCode(176)}
										</span>
									</div>
									<div className={styles.weatherCondition}>
										{weatherData?.weather[0]?.description?.toUpperCase()}
									</div>
								</div>
							</div>
							<div className={styles.place}>{weatherData?.name}</div>
							<div className={styles.date}>{date}</div>
						</>
					) : (
						<div className={styles.place}>Loading...</div>
					)}
				</div>
			</article>
		</main>
	)
}
