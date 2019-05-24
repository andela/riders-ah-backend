import express from 'express';
import articleController from '../../../controllers/article.controller';
import Auth from '../../../middlewares/auth';
import TagMiddleware from '../../../middlewares/tag.middleware';
import ArticleHelper from '../../../helpers/article';
import ArticleMiddleware from '../../../middlewares/article';
import Ratingcontroller from '../../../controllers/rating.controller';
import statsController from '../../../controllers/read.stats.controller';

const router = express.Router();

router.post('/', Auth, ArticleHelper.isValidArticle, articleController.createArticle);
router.put('/:slug', Auth, ArticleHelper.isOwner, ArticleHelper.isValidUpdatedArticle, articleController.updateArticle);
router.delete('/:slug', Auth, ArticleHelper.isOwner, articleController.deleteArticle);
router.get('/:slug', articleController.getArticle);
router.get('/', ArticleMiddleware.searchArticle, articleController.getAllArticles);
router.post('/:slug/ratings', Auth, ArticleMiddleware.checkRatedArticle, Ratingcontroller.rateArticle);
router.get('/:slug/ratings', Auth, Ratingcontroller.getArticleRating);
router.post('/:slug/reaction/:option', Auth, ArticleHelper.isExisting, articleController.reactOnArticle);
router.get('/:slug/likes', Auth, ArticleHelper.likesNumber, articleController.getLikes);
router.get('/:slug/dislikes', Auth, ArticleHelper.dislikesNumber, articleController.getDislikes);
router.post('/:slug/tag', Auth, ArticleHelper.isOwner, TagMiddleware.isNotTagAdded, articleController.tagArticle);
router.get('/tag/list', articleController.getAllTags);
router.post('/:slug/share/:option', Auth, ArticleHelper.isPlatformValid, ArticleHelper.isShared, articleController.shareArticle);
router.get('/:slug/shares', Auth, articleController.getShares);
router.post('/:slug/bookmark', Auth, ArticleHelper.articleToBookmark, ArticleHelper.createBookmark, articleController.bookmarkArticle);
router.get('/user/bookmarks', Auth, articleController.getBookmarks);
router.get('/reading/statistics', Auth, statsController.getArticlesReadingStats);

export default router;
