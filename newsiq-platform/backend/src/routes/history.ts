import { Router } from 'express';
import { logReadingHistory, getReadingHistory, clearReadingHistory } from '../controllers/historyController';
import { authenticateToken } from '../middleware/authenticateToken';

const router = Router();

// All history routes require authentication
router.use(authenticateToken);

router.post('/:articleId', logReadingHistory);
router.get('/', getReadingHistory);
router.delete('/', clearReadingHistory);

export default router;
