import express from 'express';
import { getLeads, createLead, updateLead, deleteLead, exportLeads } from '../controllers/leadController';
import { authMiddleware } from '../middleware/authMiddleware';
import { validateRequest } from '../middleware/validateRequest';
import { createLeadSchema, updateLeadSchema } from '../validation/leadValidation';
import { UserRole } from '../../shared/types';

const router = express.Router();

router.use(authMiddleware());

router.get('/', getLeads);
router.get('/export', exportLeads);
router.post('/', validateRequest(createLeadSchema), createLead);
router.put('/:id', validateRequest(updateLeadSchema), updateLead);
// Only Admin can delete a lead
router.delete('/:id', authMiddleware([UserRole.ADMIN]), deleteLead);

export default router;
