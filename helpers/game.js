import db from '../models';
import PassportHelper from './passport';
import sendEmail from './utils/mail-sender';


const {
  GameRoom, User, UserMarks
} = db;
/**
 * @author Samuel Niyitanga
 * @exports ArticleHelper
 * @class ArticleHelper
 * @description Article Helper
 * */
class GameHelper {
  /**
   * Create new Marks
   * @param {object} req - an object
   * @return {boolean} Returns if true if it is valid else return false
   * @static
   */
  static async createNewRoom(req) {
    const {
      name, emails
    } = req.body;
    const gameCreator = await PassportHelper.findRecord(User, req.user.id);
    const userData = {
      username: gameCreator.username,
      email: gameCreator.email,
      bio: gameCreator.bio,
      image: gameCreator.image
    };
    await this.sendInviteEmails(userData, emails);
    const gameRoom = await GameRoom.create({
      name,
      emails,
      userId: req.user.id
    });
    const values = {
      userData,
      gameRoom
    };
    return values;
  }

  /**
   * Send invitation emails
   * @function sendInvitationEmail
   * @param  {object} userData - user Data
   * @param  {Array} emails - user email
   * @return {boolean} has sent
   * @static
   */
  static async sendInviteEmails(userData, emails) {
    const link = `${process.env.FRONTEND_URL}/questions`;
    await Promise.all(emails.map(async (email) => {
      const info = {
        email,
        subject: 'Invitation to play Game',
        html: `<html> ${userData.username} invited you to play game. Click to <a href='${link}'><strong>this link</strong></a> to play the game`
      };
      await sendEmail.send(info);
    }));
  }

  /**
   * Create new Marks
   * @param {object} req - an object
   * @return {boolean} Returns if true if it is valid else return false
   * @static
   */
  static async createNewMark(req) {
    const {
      roomId, marks
    } = req.body;
    const markCreated = await UserMarks.create({
      roomId,
      marks,
      userId: req.user.id
    });
    return markCreated;
  }

  /**
   * Return all marks
   *@param {@object} req request
   *@return {object} Return all articles
   */
  static async getAllMarks() {
    const marks = await UserMarks.findAll({
      include: [
        {
          model: User,
          attributes: ['username', 'bio', 'image']
        },
        {
          model: GameRoom,
          attributes: ['id', 'name'],
        }
      ],
      attributes: ['id', 'roomId', 'marks', 'userId', 'createdAt', 'updatedAt']
    });
    return marks;
  }
}
export default GameHelper;
