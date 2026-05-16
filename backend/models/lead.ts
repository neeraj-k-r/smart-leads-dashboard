import mongoose, { Schema, Document } from 'mongoose';
import { LeadStatus, LeadSource } from '../../shared/types';

interface ILead extends Document {
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
  createdAt: Date;
}

const leadSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  status: { type: String, enum: Object.values(LeadStatus), default: LeadStatus.NEW },
  source: { type: String, enum: Object.values(LeadSource), required: true },
  createdAt: { type: Date, default: Date.now },
});

export const Lead = mongoose.model<ILead>('Lead', leadSchema);
