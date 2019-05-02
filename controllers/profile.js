import models from '../models';

const { User } = models;
/**
 *
 */
class Users {
  /**
   * @param {object} req
   * @param {object} res
   * @returns {object} return object containg user info
   */
  static async user(req, res) {
    const { id } = req.params;
    try {
      const foundUser = await User.findOne({ where: { id } });
      if (!foundUser) {
        return res.status(404).json({
          status: 404,
          message: 'User not found!'
        });
      }
      const profileData = {
        username: foundUser.username,
        bio: foundUser.bio,
        image: foundUser.image
      };
      return res.status(200).json({
        status: 200,
        data: profileData
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        error: error.message
      });
    }
  }

  /**
   * @param {object} req
   * @param {object} res
   * @returns {object} return object containg user info
   */
  static async editProfile(req, res) {
    try {
      const { id } = req.params;

      const updateProfile = await User.update(
        {
          username: req.body.username,
          bio: req.body.bio,
          image: req.body.image
        },
        { where: { id }, returning: true, plain: true }
      );

      const newProfile = {
        username: updateProfile[1].username,
        email: updateProfile[1].email,
        image: updateProfile[1].image,
        bio: updateProfile[1].bio,
        updatedAt: updateProfile[1].updatedAt
      };
      res.status(200).send({
        status: 200,
        data: newProfile
      });
    } catch (error) {
      res.status(500).json({
        status: 500,
        error: error.message
      });
    }
  }
}
export default Users;
