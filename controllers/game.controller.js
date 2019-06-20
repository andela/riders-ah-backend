import GameHelper from '../helpers/game';

/**
 * @author Samuel Niyitanga
 * @exports ArticleController
 * @class ArticleController
 * @description Handles all related articles functioanlities
 * */
class GameController {
  /**
   * Create a new Game room
   * @async
   * @param  {object} req - Request object
   * @param {object} res - Response object
   * @return {json} Returns json object
   * @static
   */
  static async createGameRoom(req, res) {
    const result = await GameHelper.createNewRoom(req);
    const game = result.gameRoom.toJSON();
    return res.status(201).send({
      game: { ...game, author: result.userData }
    });
  }

  /**
   * Create a new User Mark
   * @async
   * @param  {object} req - Request object
   * @param {object} res - Response object
   * @return {json} Returns json object
   * @static
   */
  static async createUserMark(req, res) {
    const result = await GameHelper.createNewMark(req);
    const marks = result.toJSON();
    return res.status(201).send({
      marks
    });
  }

  /**
   * @param  {object} req - Request object
   * @param {object} res - Response object
   * @returns {object} response
   *  @static
   */
  static async getAllMarks(req, res) {
    const marks = await GameHelper.getAllMarks(req.params.roomId);
    if (!marks) {
      return res.status(404).send({
        status: res.statusCode,
        error: 'marks Not found'
      });
    }
    return res.status(200).send({ marks });
  }
}
export default GameController;
