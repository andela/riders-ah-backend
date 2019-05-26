import emitter from '../eventEmitters';
import NotificationEvent from '../notificationEvent';

const initNotification = () => {
  emitter.on('onFollowPublish', NotificationEvent.notificationEmitter);
  emitter.on('onArticleInteraction', NotificationEvent.notificationEmitter);
  emitter.on('message', NotificationEvent.notificationEmitter);
};

export default initNotification;
