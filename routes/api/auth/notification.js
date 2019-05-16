import express from 'express';
import Auth from '../../../middlewares/auth';
import NotificationController from '../../../controllers/notification.controller';
import NotificationHelper from '../../../helpers/notification';

const router = express.Router();

router.put('/users/notification/set/:option', Auth, NotificationHelper.isValidOption, NotificationHelper.isOptionAvailable, NotificationController.setNotification);
router.put('/users/notification/unSet/:option', Auth, NotificationHelper.isValidOption, NotificationHelper.isOptionIn, NotificationController.unsetNotification);
router.get('/users/notification/', Auth, NotificationController.getNotificationByUser);
export default router;
