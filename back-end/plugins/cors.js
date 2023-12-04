'use strict';

const fp = require('fastify-plugin');
require('dotenv').config();

/**
 * This plugins adds some utilities to handle http errors
 *
 * @see https://github.com/fastify/fastify-sensible
 */
module.exports = fp(async function (fastify, opts) {
	fastify.register(require('@fastify/cors'), {
		origins: [process.env.ALLOWED_ORIGIN, process.env.ALLOWED_DEV_ORIGIN],
	});
});
