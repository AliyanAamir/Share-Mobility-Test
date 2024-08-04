import express from 'express';
import authRouter, { AUTH_ROUTER_ROOT } from '../auth/auth.routes';
import healthCheckRouter, {
  HEALTH_ROUTER_ROOT,
} from '../healthcheck/healthcheck.routes';
import userRouter, { USER_ROUTER_ROOT } from '../user/user.router';
import chatRouter, { CHAT_ROUTER_ROOT } from '../chat/chat.routes';

const router = express.Router();

router.use(HEALTH_ROUTER_ROOT, healthCheckRouter);

router.use(USER_ROUTER_ROOT, userRouter);

router.use(AUTH_ROUTER_ROOT, authRouter);
router.use(CHAT_ROUTER_ROOT, chatRouter);

export default router;
