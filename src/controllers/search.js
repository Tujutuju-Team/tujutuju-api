const { constants: status } = require('http2')
const axios = require('axios')
const { asyncWrapper, pagination } = require('../utils')
const { Place, Food, Restaurant } = require('../repository')

async function search(req, res, next) {
	const { q } = req.query
	const page = +req.query.page || 1
	const limit = +req.query.limit || 10
	const { PROTOCOL, DOMAIN } = process.env
	const url = `${PROTOCOL}${DOMAIN}/search`

	const { data: category } = await axios.get('http://ml:5000/', {
		params: { q: q }
	})

	const obj = {
		place: Place,
		food: Food,
		restaurant: Restaurant
	}

	let retriever = obj[category]
	if (!category in obj) {
		retriever = obj.place
	}

	const result = await pagination.getData(url, limit, page, retriever)

	res.json({
		meta: {
			code: status.OK,
			message: 'Success retrieveing data'
		},
		pagination: {
			total_data: result.totalData,
			total_page: result.totalPage,
			next_url: result.nextUrl,
			prev_url: result.prevUrl
		},
		data: result.data
	})
}

module.exports = { search: asyncWrapper(search) }
