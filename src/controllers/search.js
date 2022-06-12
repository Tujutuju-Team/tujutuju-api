const { constants: status } = require('http2')
const axios = require('axios')
const { asyncWrapper, pagination } = require('../utils')
const { Place, Food, Restaurant } = require('../repository')
const { query } = require('../utils/db')

async function search(req, res, next) {
	const { q } = req.query
	const page = +req.query.page || 1
	const limit = +req.query.limit || 10
	const { PROTOCOL, DOMAIN } = process.env
	const url = `${PROTOCOL}${DOMAIN}/search`

	const pq = `
		SELECT * FROM places 
		WHERE name ILIKE $1 OR description ILIKE $1
	`
	const rq = `
		SELECT * FROM restaurants 
		WHERE name ILIKE $1 OR description ILIKE $1
	`
	const fq = `
		SELECT * FROM foods
		WHERE name ILIKE $1 OR description ILIKE $1
	`

	const [{ rows: places }, { rows: restaurants }, { rows: foods }] =
		await Promise.all([
			query(pq, ['%' + q + '%']),
			query(rq, ['%' + q + '%']),
			query(fq, ['%' + q + '%'])
		])

	if (places.length > 0 || restaurants.length > 0 || foods.length > 0) {
		return res.json({
			meta: {
				code: status.HTTP_STATUS_OK,
				message: 'Success retrieveing data'
			},
			data: { places, restaurants, foods }
		})
	}

	const { data } = await axios.get('http://ml:5000/', {
		params: { q: q }
	})

	const obj = {
		food: Food,
		restaurant: Restaurant,
		place: Place,
		beach: Place,
		temple: Place,
		museum: Place,
		hotel: Place
	}

	const retriever = obj[data.result]
	if (!retriever) {
		return res
			.status(status.HTTP_STATUS_NOT_FOUND)
			.json({ error: { message: 'Result not found', category } })
	}

	const result = await retriever.find({ offset: 0, limit: 10 })
	const p = retriever === Place ? result : []
	const r = retriever === Restaurant ? result : []
	const f = retriever === Food ? result : []

	res.json({
		meta: {
			code: status.HTTP_STATUS_OK,
			message: 'Success retrieveing data'
		},
		data: {
			places: [...places, ...p],
			restaurants: [...restaurants, ...r],
			foods: [...foods, ...f]
		}
	})
}

module.exports = { search: asyncWrapper(search) }
