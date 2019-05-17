import model from '../models';

const { User } = model;

const canEditProfile = async (req, res, next) => {
  const { username } = req.params;
  const userModel = await User.findOne({ where: { id: req.user.id } });
  return userModel.username !== username
    ? res.status(401).send({
      status: 401,
      message: 'You are not allowed to edit this profile'
    })
    : next();
};
export default canEditProfile;
