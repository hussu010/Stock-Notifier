import express, { Express } from 'express';
import dotenv from 'dotenv';
dotenv.config();

import {
  getClientCollateralDetails,
  getDailyOrderBook,
  isOrderEngineOpen,
  getDPHoldings,
  getStockQuote,
} from './src/tms/tms.utils';

if (process.env.NODE_ENV != 'test') {
  import('./src/common/config/dbConnect');
}

const app: Express = express();
import morgan from 'morgan';
import cors from 'cors';

import { errorLogger, errorResponder } from './src/common/middlewares/errors';
import { stream } from './src/common/config/winston';

import * as swaggerUi from 'swagger-ui-express';
import * as swaggerDocument from './swagger.json';

import orderRouter from './src/orders/orders.route';
import alertRouter from './src/alerts/alerts.route';
import {
  scanNotificationTriggers,
  scanAlertTriggers,
} from './src/common/utils/notification';
app.use(errorLogger);
import tmsAuthRouter from './src/tms/tms.route';

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

app.post('/__space/v0/actions', async (req, res, next) => {
  try {
    const event = req.body.event;

    const clientCollateralDetails = await getClientCollateralDetails();
    console.log(clientCollateralDetails);

    await getDailyOrderBook();

    await getDPHoldings();

    await getStockQuote('STC');

    console.log('isOrderEngineOpen', await isOrderEngineOpen());

    if (event && event.id === 'scanNotificationTriggers') {
      await scanNotificationTriggers();
    } else if (event && event.id === 'AlertNotificationTriggers') {
      await scanAlertTriggers();
    }

    res
      .status(200)
      .json({ message: 'Scanned notification trigger successfully.' });
  } catch (error) {
    next(error);
  }
});

app.use('/api/orders', orderRouter);
app.use('/alerts', alertRouter);
app.use('/tms-auth', tmsAuthRouter);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(errorResponder);

export default app;
