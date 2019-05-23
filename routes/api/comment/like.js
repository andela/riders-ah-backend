import express from 'express';
import Auth from '../../../middlewares/auth';
import comment from '../../../controllers/comment.controller';
import commentHelper from '../../../helpers/commentHelper';

const router = express.Router();
router.delete('/:id', Auth, commentHelper.isFeedbackExist, comment.deleteFeedback);
router.post('/:id/feedback/:option', Auth, commentHelper.isValidOption, commentHelper.isItValidComment, comment.reactOnComment);
router.get('/:id/likes', commentHelper.likesNumber, comment.getLikes);


export default router;
