import { Router } from 'express';
import { createAlert, getAlerts, toggleAlert, deleteAlert } from '../controllers/alertController';
import { authenticateToken } from '../middleware/authenticateToken';

const router = Router();

// All alert routes require authentication
router.use(authenticateToken);

router.post('/', createAlert);
router.get('/', getAlerts);
router.patch('/:id', toggleAlert);
router.delete('/:id', deleteAlert);

export default router;
