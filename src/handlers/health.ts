import { RouteOptions } from 'fastify';

export const healthHandler: RouteOptions = {
    method: 'GET',
    url: '/health',
    schema: {
        response: {
            200: {
                type: 'object',
                properties: {
                    status: { type: 'string' }
                }
            }
        }
    },
    handler: async (request, reply) => {
        reply.send({ status: 'happy' });
    },
};
