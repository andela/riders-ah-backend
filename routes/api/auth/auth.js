import express from 'express';
import passport from 'passport';
import Strategy from '../../../config/passport';
import userController from '../../../controllers/user.controller';


const router = express.Router();


const allStrategy = new Strategy();


router.get('/facebook', passport.authenticate(allStrategy.strategyTouse('facebook')));
router.get('/facebook/callback', passport.authenticate(allStrategy.strategyTouse('facebook'), { session: false }), userController.socialAuth);


router.get('/google', passport.authenticate(allStrategy.strategyTouse('google'), { scope: ['email'] }));
router.get('/google/callback', passport.authenticate(allStrategy.strategyTouse('google'), { scope: ['email', 'profile'], session: false }), userController.socialAuth);

router.get('/twitter', passport.authenticate(allStrategy.strategyTouse('twitter'), { scope: ['email'] }));
router.get('/twitter/callback', passport.authenticate(allStrategy.strategyTouse('twitter'), { scope: ['email'], session: false }), userController.socialAuth);

export default router;
