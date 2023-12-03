'use strict';

module.exports = async (fastify, opts) => {
	const settingsCollection = fastify.mongo.db.collection('settings');

	fastify.addHook('preValidation', fastify.authenticate);

	fastify.get('/', async (request, reply) => {
		return await settingsCollection.findOne(
			{ userId: request?.user?.sub },
			{ projection: { userId: 0, _id: 0 } }
		);
	});

	fastify.put('/', async (request, reply) => {
		const settings = {
			type: request?.body?.type,
			cost: request?.body?.cost,
			quantity: request?.body?.quantity,
		};

		if (request?.body?.type === 'Bag') {
			Object.assign(settings, {
				filters: {
					cost: request?.body?.filters?.cost,
					quantity: request?.body?.filters?.quantity,
				},
				papers: {
					cost: request?.body?.papers?.cost,
					quantity: request?.body?.papers?.quantity,
				},
			});
		} else if (request?.body?.type !== 'Package') {
			// error;
			throw new Error('Bad request');
		}

		const existingSettings = await settingsCollection.findOne({ userId });

		if (existingSettings) {
			return await settingsCollection.updateOne({
				id: existingSettings?.id,
				userId: request?.user?.sub,
				...settings,
			});
		}
		return await settingsCollection.insertOne({
			userId: request?.user?.sub,
			...settings,
		});
	});
};
