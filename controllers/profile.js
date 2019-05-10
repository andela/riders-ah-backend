import models from '../models';
import Helper from '../helpers/user.helper';
import recordHelper from '../helpers/passport';

const { User, Follows } = models;
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
    const { username } = req.params;
    try {
      const foundUser = await User.findOne({ where: { username } });
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
      const { username } = req.params;
      const updateProfile = await User.update(
        {
          username: req.body.username,
          bio: req.body.bio,
          image: req.body.image
        },
        { where: { username }, returning: true, plain: true }
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

  /**
   * @param {object} req
   * @param {object} res
   * @returns {object} return object containg status code and user
   */
  static async followUser(req, res) {
    const { ...userInfo } = req.body;
    userInfo.userId = req.user.id;
    const newSavedFollow = await Helper.saveFollower(userInfo);

    return res.status(201).json({
      status: 201,
      user: newSavedFollow
    });
  }

  /**
   * @param {object} req
   * @param {object} res
   * @returns {object} return object containg status code and user
   */
  static async unfollowUser(req, res) {
    const { followId } = req.body;
    const conditions = {
      following: req.user.id, follower: followId
    };
    const follow = await recordHelper.findRecord(Follows, conditions);
    await follow.destroy({ force: true });
    return res.status(200).json({
      status: 200,
      message: 'User removed in your following'
    });
  }

  /**
   * @param {object} req
   * @param {object} res
   * @returns {object} return list of followings
   */
  static async getUserFollowingsList(req, res) {
    const lists = await Helper.userFollowings(req.user.id);

    const userFollowings = await Helper.serializeUsers(lists, 'follower');
    return res.status(200).json({
      status: 200,
      followings: userFollowings
    });
  }

  /**
   * @param {object} req
   * @param {object} res
   * @returns {object} return list of followings
   */
  static async getUserFollowersList(req, res) {
    const lists = await Helper.userFollowers(req.user.id);

    const userFollowers = await Helper.serializeUsers(lists, 'following');
    return res.status(200).json({
      status: 200,
      followers: userFollowers
    });
  }
}
export default Users;
