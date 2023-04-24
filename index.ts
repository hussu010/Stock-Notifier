import express, { Express } from 'express';
import dotenv from 'dotenv';
dotenv.config();

import('./src/common/config/dbConnect');

const app: Express = express();
import morgan from 'morgan';
import cors from 'cors';

import { errorLogger, errorResponder } from './src/common/middlewares/errors';
import { stream } from './src/common/config/winston';

import * as swaggerUi from 'swagger-ui-express';
import * as swaggerDocument from './swagger.json';

import notificationRouter from './src/notifications/notifications.route';

app.enable('trust proxy');
app.use(cors());
app.use(
  morgan(
    // Standard Apache combined log output plus response time
    ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" - :response-time ms',
    { stream }
  )
);
app.use(express.json());

app.use('/notifications', notificationRouter);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(errorLogger);
app.use(errorResponder);

export default app;
