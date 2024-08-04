import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { ExpressAdapter } from '@bull-board/express';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import express from 'express';
import session from 'express-session';
import helmet from 'helmet';
import morgan from 'morgan';
import { createServer } from 'node:http';
import process from 'node:process';
import config from './config/config.service';
import logger, { httpLogger } from './lib/logger.service';
import { useSocketIo } from './lib/realtime.server';
import redisStore from './lib/session.store';
import { extractJwt } from './middlewares/extract-jwt-schema.middleware';
import apiRoutes from './routes/routes';

const boostrapServer = async () => {
  const app = express();

  app.set('trust proxy', true);

  const server = createServer(app);
  useSocketIo(server);

  if (config.NODE_ENV === 'development') {
    app.use(morgan('dev'));
  } else {
    app.use(httpLogger);
  }
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  app.use(
    session({
      secret: config.JWT_SECRET,
      resave: false,
      saveUninitialized: true,
      cookie: { secure: true },
      store: redisStore,
    }),
  );

  app.use(cookieParser());

  app.use(compression());

  app.use(extractJwt);

  if (config.NODE_ENV === 'production') {
    app.use(helmet());
  }

  app.use('/api', apiRoutes);

  const serverAdapter = new ExpressAdapter();
  serverAdapter.setBasePath('/admin/queues');
  createBullBoard({
    queues: Object.entries(global.__registeredQueues || {}).map(
      ([, values]) => new BullMQAdapter(values.queue),
    ),
    serverAdapter,
  });

  app.use('/admin/queues', serverAdapter.getRouter());

  server.listen(config.PORT, () => {
    logger.info(`Server is running on http://localhost:${config.PORT}`);
    logger.info(`RESTful API: http://localhost:${config.PORT}/api`);
    logger.info(`BullBoard: http://localhost:${config.PORT}/admin/queues`);
  });
};

boostrapServer().catch((err) => {
  logger.error(err.message);
  process.exit(1);
});
