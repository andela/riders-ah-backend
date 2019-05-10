import express from 'express';
import articleController from '../../../controllers/article.controller';
import Auth from '../../../middlewares/auth';
import ArticleHelper from '../../../helpers/article';

const router = express.Router();

router.post('/', Auth, ArticleHelper.isValidArticle, articleController.createArticle);
router.put('/:slug', Auth, ArticleHelper.isOwner, ArticleHelper.isValidUpdatedArticle, articleController.updateArticle);
router.delete('/:slug', Auth, ArticleHelper.isOwner, articleController.deleteArticle);
router.get('/:slug', articleController.getArticle);
router.get('/', articleController.getAllArticles);

export default router;
