'use strict';

const fp = require('fastify-plugin');
require('dotenv').config();

module.exports = fp(async (fastify, opts) => {
	fastify.register(require('fastify-auth0-verify'), {
		secret: process.env.AUTH_SECRET,
		domain: process.env.AUTH_DOMAIN,
		audience: [`https://${process.env.AUTH_DOMAIN}/api/v2/`],
	});
});
