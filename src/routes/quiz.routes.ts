import { Router } from 'express';
import { QuizController } from '../controllers/quiz.controller';
import { optionalAuth } from '../middleware/auth.middleware';

const router = Router();

router.get('/', QuizController.index);
router.get('/progress', optionalAuth, QuizController.getProgress);
router.post('/progress', optionalAuth, QuizController.saveProgress);
router.post('/progress/reset', optionalAuth, QuizController.resetProgress);
router.get('/:id', QuizController.show);

export default router;
