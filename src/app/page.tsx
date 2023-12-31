'use client'
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffect, useState } from 'react'
import styles from './page.module.css'

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

	function showWeatherAlert() {
		if (!weatherData || !weatherData.weather || !weatherData.weather[0]) {
			return false
		}

		const condition = weatherData.weather[0].description.toLowerCase()

		// Check for specific weather conditions to show the alert
		switch (condition) {
			case 'smoke':
			case 'mist':
			case 'haze':
			case 'dust':
			case 'tornado':
				return true // Show alert for Smoke, Mist, Haze, Dust, and Tornado
			default:
				return false
		}
	}

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
								{weatherData?.weather[0]?.description === 'rain' ||
								weatherData?.weather[0]?.description === 'fog' ? (
									<i
										className={`wi wi-day-${weatherData?.weather[0]?.description}`}
									></i>
								) : (
									<i className="wi wi-day-cloudy"></i>
								)}
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
			</article>
		</main>
	)
}
