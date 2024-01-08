import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: any) {
	const { searchParams } = new URL(request.url)
	const address = searchParams.get('address')
	const latitude = searchParams.get('lat')
	const longitude = searchParams.get('lon')

	let url = ''
	if (address) {
		url =
			'https://api.openweathermap.org/data/2.5/weather?q=' +
			address +
			'&lang=pt_br'+
			'&appid=' +
			'83c6abdcf2161f1435149e9cff3adbc9'	
	} else {
		url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&lang=pt_br&appid=83c6abdcf2161f1435149e9cff3adbc9`
	}
	const res = await fetch(url)
	const data = await res.json()
	return NextResponse.json({ data })
}
