import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get('address');
  const latitude = searchParams.get('lat');
  const longitude = searchParams.get('lon');

  const apiKey = process.env.OPENWEATHER_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'API key not found' }, { status: 500 });
  }

  let url = '';
  if (address) {
    url = `https://api.openweathermap.org/data/2.5/forecast?q=${address}&lang=pt_br&appid=${apiKey}`;
  } else {
    url = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&lang=pt_br&appid=${apiKey}`;
  }

  try {
    const res = await fetch(url);
    const data = await res.json();

    // Retorna a previsão das próximas 5 horas
    const hourlyForecast = data.list.slice(0, 5).map((forecast: any) => ({
      temp: forecast.main.temp,
      dt: forecast.dt,
    }));

    // Formata a resposta para incluir dados gerais e previsão
    return NextResponse.json({
      data: {
        ...data.city,
        main: data.list[0].main,
        weather: data.list[0].weather,
        wind: data.list[0].wind,
        hourly: hourlyForecast,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch weather data' },
      { status: 500 },
    );
  }
}
