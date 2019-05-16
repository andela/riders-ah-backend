const notifications = (sequelize, DataTypes) => {
  const Notification = sequelize.define('Notification', {
    userId: DataTypes.INTEGER,
    notificationMessage: DataTypes.TEXT
  }, {});
  Notification.associate = (models) => {
    Notification.belongsTo(models.User, { as: 'user' });
  };
  return Notification;
};
export default notifications;
