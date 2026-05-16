import mongoose, { Schema, Document } from 'mongoose';
import { UserRole } from '../../shared/types';

interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
}

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: Object.values(UserRole), default: UserRole.SALES_USER },
});

export const User = mongoose.model<IUser>('User', userSchema);
