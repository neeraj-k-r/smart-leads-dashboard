import { z } from 'zod';
import { LeadStatus, LeadSource } from '../../shared/types';

export const createLeadSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name is required and must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    status: z.nativeEnum(LeadStatus).optional(),
    source: z.nativeEnum(LeadSource)
  })
});

export const updateLeadSchema = z.object({
  params: z.object({
    id: z.string()
  }),
  body: z.object({
    name: z.string().min(2).optional(),
    email: z.string().email().optional(),
    status: z.nativeEnum(LeadStatus).optional(),
    source: z.nativeEnum(LeadSource).optional()
  })
});
