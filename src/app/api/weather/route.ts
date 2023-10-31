import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
	// Allow requests from any origin (you can customize this based on your needs)
	const headers = {
		'Access-Control-Allow-Origin': '*',
		'Access-Control-Allow-Methods': 'GET, OPTIONS',
		'Access-Control-Allow-Headers':
			'Origin, X-Requested-With, Content-Type, Accept',
	}

	// Handle preflight requests (OPTIONS method)
	if (request.method === 'OPTIONS') {
		return NextResponse.json({ data: null }, { headers, status: 200 })
	}

	const { searchParams } = new URL(request.url)
	const address = searchParams.get('address')
	const latitude = searchParams.get('lat')
	const longitude = searchParams.get('lon')

	let url = ''
	if (address) {
		url =
			'https://api.openweathermap.org/data/2.5/weather?q=' +
			address +
			'&lang=pt_br' +
			'&appid=' +
			'83c6abdcf2161f1435149e9cff3adbc9'
	} else {
		url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&lang=pt_br&appid=83c6abdcf2161f1435149e9cff3adbc9`
	}

	try {
		const res = await fetch(url)
		const data = await res.json()
		return NextResponse.json({ data }, { headers })
	} catch (error) {
		// Handle errors appropriately
		console.error('Error fetching weather data:', error)
		return NextResponse.json(
			{ data: null, error: 'Internal Server Error' },
			{ headers, status: 500 },
		)
	}
}
