import express from 'express';
import authRoute from './auth.route';
import userRoute from './user.route';
import fileUploadRoute from './fileUpload.route';
import quizRoute from './quiz.routes';
import partnerRoute from './partner.route';
import healthRouter from './health.route';

const router = express.Router();

router.get('/v1', (_, res) => {
  res.json({
    message: 'Welcome to node-postg-template API',
  });
});

router.use('/v1/auth', authRoute);
router.use('/v1', authRoute);
router.use('/v1/users', userRoute);
router.use('/v1/quiz', quizRoute);
router.use('/v1/file-uploads', fileUploadRoute);
router.use('/v1/partner', partnerRoute);
router.use('/health', healthRouter);

export default router;
