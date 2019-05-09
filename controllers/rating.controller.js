import db from '../models';
import PassportHelper from '../helpers/passport';

const { Rating, User } = db;
/**
 * @exports RatingController
 * @class RatingController
 * @description Rate a specific article
 * */
class RatingController {
  /**
     * Check the environment
     * @function rateArticle
     * @param  {object} req - accept object with user info
     * @param  {object} res - accept object with user info
     * @return {json} Returns json object
     * @static
     */
  static async rateArticle(req, res) {
    const { rate } = req.body;
    const rateAuthor = await PassportHelper.findRecord(User, req.user.id);
    const userData = {
      username: rateAuthor.username,
      email: rateAuthor.email,
      bio: rateAuthor.bio,
      image: rateAuthor.image
    };
    const ratings = await Rating.findOne({
      where: { reviewerId: rateAuthor.id, articleId: req.params.id }
    });
    if (ratings) {
      const [, updatedRating] = await Rating.update(
        { rate },
        { where: { id: ratings.id }, returning: true }
      );
      return res.status(201).send({
        status: res.statusCode,
        data: { rating: updatedRating, Author: userData }
      });
    }
    const rating = await Rating.create({
      rate,
      articleId: req.params.id,
      reviewerId: rateAuthor.id
    });
    return res.status(201).send({
      status: res.statusCode,
      data: { rating, Author: userData }
    });
  }
}
export default RatingController;
