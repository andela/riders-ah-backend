import models from '../models/index';

const { User } = models;
/**
 * @export RoleAccess
 * @class RoleAccess
 */
class RoleAccess {
  /**
   * @param {Parameters} id
   * @param {object} res
   * @returns {object} return object containg user info
   */
  static async findOne(id) {
    const findUser = await User.findOne({ where: { id } });

    if (!findUser) {
      return { status: 404, message: 'No user found!' };
    }
    return findUser;
  }
}
export default RoleAccess;
