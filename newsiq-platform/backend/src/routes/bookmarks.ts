import { Router } from 'express';
import { addBookmark, removeBookmark, getBookmarks } from '../controllers/bookmarkController';
import { authenticateToken } from '../middleware/authenticateToken';

const router = Router();

// All bookmark routes require authentication
router.use(authenticateToken);

router.post('/:articleId', addBookmark);
router.delete('/:articleId', removeBookmark);
router.get('/', getBookmarks);

export default router;
