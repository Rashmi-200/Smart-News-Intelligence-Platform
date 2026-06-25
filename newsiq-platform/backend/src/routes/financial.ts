import { Router } from 'express';
import { getMarketData, getFinancialNews, getSentimentTrend, getTopCompanies } from '../controllers/financialController';

const router = Router();

router.get('/market-data', getMarketData);
router.get('/news', getFinancialNews);
router.get('/sentiment-trend', getSentimentTrend);
router.get('/top-companies', getTopCompanies);

export default router;
