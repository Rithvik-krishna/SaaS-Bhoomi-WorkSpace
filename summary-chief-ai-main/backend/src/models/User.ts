import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  email: string;
  name: string;
  googleId?: string;
  googleTokens?: {
    access_token: string;
    refresh_token: string;
    scope: string;
    expiry_date: number;
  };
  googleProfile?: {
    id: string;
    email: string;
    name: string;
    picture?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  googleId: {
    type: String,
    sparse: true
  },
  googleTokens: {
    access_token: String,
    refresh_token: String,
    scope: String,
    expiry_date: Number
  },
  googleProfile: {
    id: String,
    email: String,
    name: String,
    picture: String
  }
}, {
  timestamps: true
});

// Create indexes for better query performance
UserSchema.index({ email: 1 });
UserSchema.index({ googleId: 1 });

export default mongoose.model<IUser>('User', UserSchema);
