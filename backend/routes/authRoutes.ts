import express from 'express';
import { register, login } from '../controllers/authController';
import { validateRequest } from '../middleware/validateRequest';
import { registerSchema, loginSchema } from '../validation/authValidation';

const router = express.Router();

router.post('/register', validateRequest(registerSchema), register);
router.post('/login', validateRequest(loginSchema), login);

export default router;
