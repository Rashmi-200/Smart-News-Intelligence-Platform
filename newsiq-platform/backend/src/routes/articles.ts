import { Router } from 'express';
import {
  getArticles,
  getArticleById,
  getTrendingArticles,
  searchArticles,
  incrementViewCount,
  getCategories,
} from '../controllers/articleController';

const router = Router();

// IMPORTANT: specific named routes before :id param routes
router.get('/trending', getTrendingArticles);
router.get('/search',   searchArticles);

router.get('/',         getArticles);
router.get('/:id',      getArticleById);
router.post('/:id/view', incrementViewCount);

export default router;
