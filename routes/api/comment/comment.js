import express from 'express';
import Auth from '../../../middlewares/auth';
import comment from '../../../controllers/comment.controller';
import commentHelper from '../../../helpers/commentHelper';

const router = express.Router();

router.post('/:slug/comments', Auth, commentHelper.parentId, commentHelper.isValid, comment.addComment);
router.get('/:slug/comments', Auth, comment.getComments);
router.get('/:slug/comments/:id', Auth, comment.getOneComment);
router.delete('/:slug/comments/:id', Auth, commentHelper.isCommentExist, comment.deleteOneComment);
router.post('/:slug/comments/:id', Auth, commentHelper.isCommentExist, comment.updateOneComment);
router.post('/:id/reply', Auth, commentHelper.commentExist, comment.replyComment);
router.get('/:id/replies', Auth, comment.getCommentReplies);
router.delete('/:id/reply/:replyId', Auth, commentHelper.isReplytExist, comment.deleteOneReply);
router.post('/:id/reply/:replyId', Auth, commentHelper.isReplytExist, comment.updateOneReply);

export default router;
