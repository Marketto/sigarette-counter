'use strict';

const fp = require('fastify-plugin');
require('dotenv').config();

module.exports = fp(async (fastify, opts) => {
	const url = `mongodb${
		process.env.MONGO_SRV ? '+srv' : ''
	}://${encodeURIComponent(process.env.MONGO_USER)}:${encodeURIComponent(
		process.env.MONGO_PWD
	)}@${process.env.MONGO_HOST}/${process.env.MONGO_DB}`;
	fastify.register(require('@fastify/mongodb'), {
		// force to close the mongodb connection when app stopped
		// the default value is false
		forceClose: true,
		url,
	});
});
