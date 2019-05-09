import express from 'express';
import articleController from '../../../controllers/article.controller';
import Auth from '../../../middlewares/auth';
import ArticleHelper from '../../../helpers/article';
import ArticleMiddleware from '../../../middlewares/article';
import Ratingcontroller from '../../../controllers/rating.controller';

const router = express.Router();

router.post('/', Auth, ArticleHelper.isValidArticle, articleController.createArticle);
router.put('/:slug', Auth, ArticleHelper.isOwner, ArticleHelper.isValidUpdatedArticle, articleController.updateArticle);
router.delete('/:slug', Auth, ArticleHelper.isOwner, articleController.deleteArticle);
router.get('/:slug', articleController.getArticle);
router.get('/', articleController.getAllArticles);
router.post('/rate/:id', Auth, ArticleMiddleware.checkRatedarticle, Ratingcontroller.rateArticle);

export default router;
