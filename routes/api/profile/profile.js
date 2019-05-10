import express from 'express';
import user from '../../../controllers/profile';
import auth from '../../../middlewares/auth';
import canEditProfile from '../../../middlewares/editProfile';
import userMiddleware from '../../../middlewares/user.middleware';

const router = express.Router();

router.get('/:username', user.user);
router.put('/:username', auth, canEditProfile, user.editProfile);

router.post('/:username/follow', auth, userMiddleware.isUserValid, userMiddleware.isNotFollowingUser, user.followUser);
router.post('/:username/unfollow', auth, userMiddleware.isUserValid, userMiddleware.isFollowingUser, user.unfollowUser);
router.get('/:username/following', auth, userMiddleware.isAllowed, user.getUserFollowingsList);
router.get('/:username/followers', auth, userMiddleware.isAllowed, user.getUserFollowersList);


export default router;
