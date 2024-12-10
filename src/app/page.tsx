/* Inside your React component file */
'use client';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import styles from './page.module.css';

interface WeatherData {
  main: {
    temp: number;
    feels_like: number;
  };
  weather: {
    description: string;
    icon: string;
  }[];
  wind: {
    speed: number;
  };
  name: string;
  hourly: {
    temp: number;
    dt: number;
  }[];
}

function getCurrentDate() {
  const currentDate = new Date();
  const options = { month: 'long' } as Intl.DateTimeFormatOptions;
  const monthName = currentDate.toLocaleString('pt-br', options);
  const date = new Date().getDate() + ', ' + monthName;
  return date;
}

export default function Home() {
  const date = getCurrentDate();
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [city, setCity] = useState('recife');
  const [showDetails, setShowDetails] = useState(false);

  async function fetchData(cityName: string): Promise<void> {
    try {
      const response = await fetch('/api/weather?address=' + cityName);
      const jsonData: { data: WeatherData } = await response.json();
      setWeatherData(jsonData.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  async function fetchDataByCoordinates(
    latitude: number,
    longitude: number,
  ): Promise<void> {
    try {
      const response = await fetch(
        `/api/weather?lat=${latitude}&lon=${longitude}`,
      );
      const jsonData: { data: WeatherData } = await response.json();
      setWeatherData(jsonData.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchDataByCoordinates(latitude, longitude);
        },
        (error) => {
          console.error('Error getting geolocation:', error);
        },
      );
    }
  }, []);

  return (
    <main className={styles.main}>
      <article className={styles.widget}>
        <div className="components">
          <form
            className={styles.weatherLocation}
            onSubmit={(e) => {
              e.preventDefault();
              fetchData(city);
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
                  <Image
                    src={`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
                    alt="/"
                    width="100"
                    height="100"
                  />
                </div>
                <div className={styles.weatherInfo}>
                  <div className={styles.temperature}>
                    <span>
                      {(weatherData.main.temp - 273.5).toFixed(1) + '°'}
                    </span>
                  </div>
                  <div className={styles.weatherCondition}>
                    {weatherData.weather[0].description.toUpperCase()}
                  </div>
                </div>
              </div>
              <div className={styles.place}>{weatherData.name}</div>
              <div className={styles.date}>{date}</div>
              <button
                className={styles.details_button}
                onClick={() => setShowDetails(!showDetails)}
              >
                + Detalhes
              </button>
              {showDetails && (
                <div className={styles.detailsDropdown}>
                  <p>
                    Sensação Térmica:{' '}
                    {(weatherData.main.feels_like - 273.5).toFixed(1)}°
                  </p>
                  <p>Vento: {weatherData.wind.speed} m/s</p>
                  <p>Previsão para próximas horas:</p>
                  <ul>
                    {weatherData.hourly?.map((hour) => (
                      <li key={hour.dt}>
                        {new Date(hour.dt * 1000).toLocaleTimeString()} -{' '}
                        {(hour.temp - 273.5).toFixed(1)}°
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          ) : (
            <div className={styles.place}>Loading...</div>
          )}
        </div>
      </article>
    </main>
  );
}
