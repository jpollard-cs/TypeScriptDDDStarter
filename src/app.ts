import express from 'express';
// eslint-disable-next-line no-inline-comments
import compression from 'compression'; // compresses requests
import bodyParser from 'body-parser';
import lusca from 'lusca';
import path from 'path';
import helmet from 'helmet';

// Controllers (route handlers)
import * as pingController from './controllers/ping';

// Create Express server
const app = express();

// Express configuration
app.set('port', process.env.PORT || 3000);
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(lusca.xframe('SAMEORIGIN'));
app.use(lusca.xssProtection(true));
app.use(helmet());
// todo: add csrf protection via lusca or csurf

app.use(
    express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 })
);

/**
 * Primary app routes.
 */
app.get('/ping', pingController.getPing);

export default app;
