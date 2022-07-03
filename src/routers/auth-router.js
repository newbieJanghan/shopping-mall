import { Router } from 'express';
import passport from 'passport';
import { setUserToken } from '../utils';

const authRouter = Router();

// 구글 로그인
authRouter.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }),
);

// 구글 콜백 처리
authRouter.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/login',
    session: false,
  }),
  (req, res, next) => {
    try {
      // 토큰 제공
      setUserToken(res, req.user);
      res.redirect('/');
    } catch (error) {
      next(error);
    }
  },
);

export { authRouter };
