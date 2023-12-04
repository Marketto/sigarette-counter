'use strict';
const { ObjectId, Collection } = require('mongodb');

const Fastify = require('fastify');
const path = require('path');
const moment = require('moment');
const { dayBegin, dayEnd } = require('../../utils/time.utils');

/**
 * @param {Fastify.FastifyInstance} fastify
 * @param {Fastify.RouteOptions} opts
 */
module.exports = async function (fastify, opts) {
	/**
	 * @type Collection
	 */
	const historyCollection = fastify.mongo.db.collection('history');

	fastify.addHook('preValidation', fastify.authenticate);

	fastify.get(
		'/',
		/**
		 * @param {Fastify.FastifyRequest} request
		 * @param {Fastify.FastifyReply} reply
		 */
		async (request, reply) => {
			const query = {};
			const date = moment(request.params.date).isValid()
				? moment(request.params.date)
				: null;

			if (date) {
				query.date = {
					$gte: dayBegin(date).toDate(),
					$lte: dayEnd(date).toDate(),
				};
			}

			return await historyCollection
				.find(
					{
						...query,
						userId: request?.user?.sub,
					},
					{
						projection: {
							date: 1,
							_id: 0,
							outOfTobacco: 1,
							id: '$_id',
						},
					}
				)
				.sort({ date: -1 })
				.toArray();
		}
	);

	fastify.post(
		'/',
		/**
		 * @param {Fastify.FastifyRequest} request
		 * @param {Fastify.FastifyReply} reply
		 */
		async (request, reply) => {
			const record = {
				userId: request?.user?.sub,
				date: new Date(request?.body?.date),
			};
			if (request?.body?.outOfTobacco === true) {
				record.outOfTobacco = true;
			}

			const result = await historyCollection.insertOne({ ...record });
			reply.statusCode = 201;
			reply.header(
				'location',
				`${request.protocol}://${request.hostname}${path.join(
					request.url,
					result.insertedId.toString()
				)}`
			);
			reply.send({
				...record,
				id: result?.insertedId,
			});
		}
	);

	fastify.put(
		'/:id',
		/**
		 * @param {Fastify.FastifyRequest} request
		 * @param {Fastify.FastifyReply} reply
		 */
		async (request, reply) => {
			const record = {
				userId: request?.user?.sub,
				date: new Date(request?.body?.date),
			};
			if (request?.body?.outOfTobacco === true) {
				record.outOfTobacco = true;
			}

			return await historyCollection.updateOne({
				...record,
				_id: new ObjectId(request?.params?.id),
				userId: request?.user?.sub,
			});
		}
	);

	fastify.delete(
		'/:id',
		/**
		 * @param {Fastify.FastifyRequest} request
		 * @param {Fastify.FastifyReply} reply
		 */
		async (request, reply) => {
			return await historyCollection.deleteOne(
				{
					_id: new ObjectId(request?.params?.id),
					userId: request?.user?.sub,
				},
				{ justOne: true }
			);
		}
	);
};
