import express from 'express';
import Auth from '../../../middlewares/auth';
import ArticleMiddleware from '../../../middlewares/article';
import Ratingcontroller from '../../../controllers/rating.controller';

const router = express.Router();

router.post('/rate/:id', Auth, ArticleMiddleware.checkRatedarticle, Ratingcontroller.rateArticle);

export default router;
