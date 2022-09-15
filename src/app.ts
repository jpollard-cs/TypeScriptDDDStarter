import dotenv from 'dotenv';
dotenv.config();

import { AddressInfo } from 'net';

import Fastify from 'fastify';
// eslint-disable-next-line no-inline-comments
import compress from '@fastify/compress';
// import circuitBreaker from '@fastify/circuit-breaker';
import helmet from '@fastify/helmet';

import mercurius, { IResolvers } from 'mercurius';
import mercuriusCodegen, { gql } from 'mercurius-codegen';

// route handlers
import { healthHandler } from './handlers/health';

// Create Fastify server
const app = Fastify({
    // TODO: configure logging
    // https://www.fastify.io/docs/latest/Reference/Logging/
    logger: true,
});

// setup plugins (express middleware may also be used via an adapter)
// see https://www.fastify.io/docs/latest/Guides/Getting-Started/#loading-order-of-your-plugins
// TODO: we'll probably want to configure helmet more explicitly at some point
// in case defaults change - we should be careful about new releases in the meantime
const trustedDomains = ['https://unpkg.com'];

app.register(helmet, {
    // added to support graphiql
    // TODO: we may want to just disable graphiql in production
    // or serve it from the server (ideally only for priviledged users in prod)
    // https://github.com/graphql/graphiql/blob/main/packages/graphiql/README.md
    contentSecurityPolicy: {
        directives: {
            'default-src': ['\'self\'', '\'unsafe-inline\''].concat(
                trustedDomains
            ),
            'script-src': ['\'self\'', '\'unsafe-inline\'', '\'unsafe-eval\''].concat(
                trustedDomains
            ),
            'style-src': ['\'self\'', '\'unsafe-inline\''].concat(
                trustedDomains
            )
        }
    }
});

app.register(compress);
// low overhead route-based circuit breaker
// TODO: determine if we can configure this for graphql queries/mutations
// TODO: alternatively determine if we should move this up to the reverse
// proxy layer - downside there being that we can't as easily return pre-computed
// or less-expensive-to-compute results on failure
// app.register(circuitBreaker);
// other useful plugins to consider:
// https://github.com/fastify/under-pressure - can integrate this with health checks
// https://github.com/fastify/fastify-sensible
// TODO: setup cookies w/ appropriate settings (e.g. httpOnly and sameSite strict) &
// CSRF tokens once auth is in place using below plugins
// https://github.com/fastify/fastify-cookie
// https://github.com/fastify/csrf-protection
// https://github.com/fastify/csrf
// useful resources:
//    https://michaelzanggl.com/articles/web-security-cors-csrf-samesite/
//    https://developer.okta.com/blog/2022/07/08/spa-web-security-csrf-xss

// TODO: continue graphql setup with validation, proper organization, logging and SDL
// consider using https://mercurius.dev/#/docs/integrations/type-graphql

// TODO: setup tracing
// fastify and mercurius support opentelemetry

const schema = gql`
  type Query {
    hello(name: String!): String!
  }
`;

const resolvers: IResolvers = {
    Query: {
        hello(root, { name }) {
            return 'hello ' + name;
        }
    }
};

app.register(mercurius, {
    schema,
    resolvers,
    jit: 1,
    graphiql: true,
});

// TODO: configure properly per environment:
// https://github.com/mercurius-js/mercurius-typescript/tree/master/packages/mercurius-codegen
mercuriusCodegen(app, {
    // Commonly relative to your root package.json
    targetPath: './src/graphql/generated.ts'
}).catch(err => {
    app.log.error(`⛔ ${err}`);
    process.exit(1);
});

// add hooks

// app.addHook('onReady', async () => {
//     /**
//      * super useful hook if you need to do things like
//      * prime the cache before starting to serve requests
//      */
// });

/**
 * Primary app routes.
 */
// Declare a route
app.route(healthHandler);

const start = async () => {
    try {
        await app.listen({ port: parseInt(process.env.PORT || '3000') });
        app.log.info(
            '  🚀 App is running at http://localhost:%d in %s mode',
            (app.server.address() as AddressInfo).port,
            process.env.NODE_ENV || 'development'
        );
        // TODO: extend logger to add development info log level
        if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
            app.log.info('  🛑 Press CTRL-C to stop\n');
        }
    }
    catch (err) {
        app.log.error(`⛔ ${err}`);
        process.exit(1);
    }
};

// TODO: come up with reasonable error handling strategy for both expected and unhandled errors
// https://www.fastify.io/docs/latest/Reference/Errors/

start();

export default app;
