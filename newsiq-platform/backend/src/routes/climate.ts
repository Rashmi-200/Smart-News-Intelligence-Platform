import { Router } from 'express';
import { getClimateNews, getDisasterAlerts, getWeather } from '../controllers/climateController';

const router = Router();

router.get('/news', getClimateNews);
router.get('/alerts', getDisasterAlerts);
router.get('/weather/:city', getWeather);

export default router;
