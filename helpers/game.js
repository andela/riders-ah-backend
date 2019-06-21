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
    const gameRoom = await GameRoom.create({
      name,
      emails,
      userId: req.user.id
    });
    const game = gameRoom.toJSON();
    await this.sendInviteEmails(userData, emails, game);
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
   * @param  {object} game - user email
   * @return {boolean} has sent
   * @static
   */
  static async sendInviteEmails(userData, emails, game) {
    const link = `${process.env.FRONTEND_URL}/waiting/${game.id}`;
    try {
      await Promise.all(emails.map(async (email) => {
        const info = {
          email,
          subject: 'Invitation to play Game',
          html: `<html> ${userData.username} invited you to play game. Click to <a href='${link}'><strong>this link</strong></a> to play the game`
        };
        await sendEmail.send(info);
      }));
    } catch (e) {
      console.log('ERROR ==============', e);
    }
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
    let markCreated = await UserMarks.findOne({ where: { roomId, userId: req.user.id } });
    if (!markCreated) {
      markCreated = await UserMarks.create({
        roomId,
        marks,
        userId: req.user.id
      });
    }
    return markCreated;
  }

  /**
   * Return all marks
   *@param {@object} id request
   *@param {@object} req request
   *@return {object} Return all marks
   */
  static async getAllMarks(id, req) {
    const marks = await UserMarks.findAll({
      where: { roomId: id },
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
      attributes: ['id', 'roomId', 'marks', 'userId', 'createdAt', 'updatedAt'],
      order: [['marks', 'DESC']]
    });
    console.log('Marks ........', req.user.id);
    console.log('Marks ........', marks);
    return marks;
  }

  /**
   * Return all user
   *@param {Integer} roomId req
   *@return {object} Return all user in room
   */
  static async findRoomInfo(roomId) {
    const roomInfo = await GameRoom.findOne({ where: { id: roomId } });
    return roomInfo;
  }

  /**
   * Update Joined User
   *@param {object} info
   *@return {object} Return all user in room
   */
  static async updateJoinedUser(info) {
    const userInRoom = await this.findRoomInfo(info.roomId);
    const { joined } = userInRoom;
    const result = await this.findIfAlreadyJoined(joined, info.user.email);
    if (result) {
      joined.push(info.user.email);
      await GameRoom.update({ joined }, { where: { id: info.roomId } });
    }
  }

  /**
   * Return boolean
   *@param {Array} joined array
   *@param {string} email req
   *@return {boolean} Return true or false
   */
  static async findIfAlreadyJoined(joined, email) {
    return joined.indexOf(email) === -1;
  }
}
export default GameHelper;
