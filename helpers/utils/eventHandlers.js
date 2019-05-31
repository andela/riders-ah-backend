import emitter from '../eventEmitters';
import NotificationEvent from '../notificationEvent';

const initNotification = () => {
  emitter.on('onFollowPublish', NotificationEvent.sendOnArticlePublish);
  emitter.on('onArticleInteraction', NotificationEvent.sendOnArticleInterraction);
  emitter.on('message', NotificationEvent.sendOnArticlePublish);
};

export default initNotification;
