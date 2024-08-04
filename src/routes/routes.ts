import express from 'express';
import authRouter, { AUTH_ROUTER_ROOT } from '../auth/auth.routes';
import healthCheckRouter, {
  HEALTH_ROUTER_ROOT,
} from '../healthcheck/healthcheck.routes';
import userRouter, { USER_ROUTER_ROOT } from '../user/user.router';

const router = express.Router();

router.use(HEALTH_ROUTER_ROOT, healthCheckRouter);

router.use(USER_ROUTER_ROOT, userRouter);

router.use(AUTH_ROUTER_ROOT, authRouter);


export default router;
