'use client'
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffect, useState } from 'react'
import styles from './page.module.css'

function getCurrentDate() {
	return 'test'
}

export default function Home() {
	const date = getCurrentDate()
	const [weatherData, setWeatherData] = useState(null)
	const [city, setCity] = useState('recife')

	function showWeatherAlert() {
		if (!weatherData || !weatherData.weather || !weatherData.weather[0]) {
			return false
		}

		const condition = weatherData.weather[0].main.toLowerCase()

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

	async function fetchData(cityName: string) {
		try {
			const response = await fetch(
				'http://localhost:3000/api/weather?address=' + cityName,
			)
			const jsonData = (await response.json()).data
			setWeatherData(jsonData)
		} catch (error) {
			console.log('error')
		}
	}

	useEffect(() => {
		fetchData('recife')
	}, [])

	return (
		<main className={styles.main}>
			<article className={styles.widget}>
				{weatherData && weatherData.weather && weatherData.weather[0] ? (
					<>
						<div className={styles.icon_and_weatherinfo}>
							{/* Add the weather icon */}
							<div className={styles.weatherIcon}>
								{showWeatherAlert() ? (
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
														{(weatherData?.main?.temp - 273.5).toFixed(2) +
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
									<i className="wi wi-day-cloudy"></i>
								)}
							</div>

							<div className={styles.weatherInfo}>
								<div>
									<span>
										{(weatherData?.main?.temp - 273.5).toFixed(1) +
											String.fromCharCode(176)}
									</span>
								</div>
							</div>
						</div>
						<div>{weatherData?.weather[0]?.description?.toUpperCase()}</div>
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
