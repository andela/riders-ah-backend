import { roles } from '../helpers/roles';
import RoleAccess from '../helpers/accessServices';

/**
 * @author JABIRO Christian
 * @class
 * @classdesc Role
 */
class Role {
  /**
   *@function isUser
   * @param {object} req
   * @param {object} res
   * @param {object} next()
   * @returns {object} object
   */
  static async isAdmin(req, res, next) {
    const findUser = await RoleAccess.findOne(req.user.id);
    if (findUser.roles !== roles.isAdmin) {
      return res.status(401).json({ status: 401, message: 'You are not an admin!' });
    }
    next();
  }

  /**
   *@function isSuperAdmin
   * @param {object} req
   * @param {object} res
   * @param {object} next()
   * @returns {object} object
   */
  static async isSuperAdmin(req, res, next) {
    const findUser = await RoleAccess.findOne(req.user.id);
    if (findUser.roles !== roles.isSuperAdmin) {
      return res.status(401).json({ status: 401, message: 'You are not a Super Admin!' });
    }
    next();
  }
}
export default Role;
