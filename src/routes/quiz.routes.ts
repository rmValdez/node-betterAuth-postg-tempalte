import { Router } from 'express';
import { QuizController } from '../controllers/quiz.controller';

const router = Router();

router.get('/', QuizController.index);
router.get('/progress', QuizController.getProgress);
router.post('/progress', QuizController.saveProgress);
router.post('/progress/reset', QuizController.resetProgress);
router.get('/:id', QuizController.show);

export default router;
