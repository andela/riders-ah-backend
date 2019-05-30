import express from 'express';
import Auth from '../../../middlewares/auth';
import comment from '../../../controllers/comment.controller';
import commentHelper from '../../../helpers/commentHelper';
import catchErrors from '../../../middlewares/catch.errors.middleware';

const router = express.Router();

router.post('/:slug/comments', catchErrors(Auth), catchErrors(commentHelper.isValid), catchErrors(comment.addComment));
router.get('/:slug/comments', catchErrors(Auth), catchErrors(comment.getComments));
router.get('/:slug/comments/:id', catchErrors(Auth), catchErrors(comment.getOneComment));
router.get('/:slug/comments/:id/histories', catchErrors(Auth), catchErrors(comment.getCommentHistories));
router.delete('/:slug/comments/:id', catchErrors(Auth), catchErrors(commentHelper.isCommentExist), catchErrors(comment.deleteOneComment));
router.put('/:slug/comments/:id', catchErrors(Auth), catchErrors(commentHelper.isCommentExist), catchErrors(comment.updateOneComment));
router.post('/comments/:id/reply', catchErrors(Auth), catchErrors(commentHelper.commentExist), catchErrors(comment.replyComment));
router.get('/comments/:id/replies', catchErrors(Auth), catchErrors(comment.getCommentReplies));
router.delete('/comments/:id/replies/:replyId', catchErrors(Auth), catchErrors(commentHelper.isReplytExist), catchErrors(comment.deleteOneReply));
router.put('/comments/:id/replies/:replyId', catchErrors(Auth), catchErrors(commentHelper.isReplytExist), catchErrors(comment.updateOneReply));


export default router;
