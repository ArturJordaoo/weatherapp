import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	const { searchParams } = new URL(req.url)
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
		const response = await fetch(url)
		const data = await response.json()
		res.json({ data })
	} catch (error) {
		console.error('Error fetching data:', error)
		res.status(500).send('Internal Server Error')
	}
}
