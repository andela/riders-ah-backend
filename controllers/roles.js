import models from '../models';
/**
 * @param {string} req
 * @returns {object} object
 */
const { User } = models;
const Roles = async (req, res, next) => {
  const { id } = req.params;
  const { roles } = req.body;
  const findUser = await User.findOne({ where: { id } });

  if (!findUser) {
    return res.status(404).send({ error: 'User not exist' });
  }
  const updateRole = await User.update(
    {
      roles
    },
    { where: { id }, returning: true, plain: true }
  );
  if (updateRole) {
    return res.status(200).send({ status: 200, message: 'role of the user updated successfuly' });
  }
  next();
};
export default Roles;
