import express from 'express';
import articleController from '../../../controllers/article.controller';
import Auth from '../../../middlewares/auth';
import TagMiddleware from '../../../middlewares/tag.middleware';
import ArticleHelper from '../../../helpers/article';
import ArticleMiddleware from '../../../middlewares/article';
import Ratingcontroller from '../../../controllers/rating.controller';

const router = express.Router();

router.post('/', Auth, ArticleHelper.isValidArticle, articleController.createArticle);
router.put('/:slug', Auth, ArticleHelper.isOwner, ArticleHelper.isValidUpdatedArticle, articleController.updateArticle);
router.delete('/:slug', Auth, ArticleHelper.isOwner, articleController.deleteArticle);
router.get('/:slug', articleController.getArticle);
router.get('/', articleController.getAllArticles);
router.post('/rate/:id', Auth, ArticleMiddleware.checkRatedArticle, Ratingcontroller.rateArticle);
router.post('/:slug/reaction/:option', Auth, ArticleHelper.isExisting, articleController.reactOnArticle);
router.get('/:slug/likes', Auth, ArticleHelper.likesNumber, articleController.getLikes);
router.get('/:slug/dislikes', Auth, ArticleHelper.dislikesNumber, articleController.getDislikes);
router.post('/:slug/tag', Auth, ArticleHelper.isOwner, TagMiddleware.isNotTagAdded, articleController.tagArticle);
router.get('/tag/list', articleController.getAllTags);

export default router;
