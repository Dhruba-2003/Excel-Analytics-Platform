// File: backend/src/models/userModel.js
import mongoose from 'mongoose';

const userSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, required: true, default: false },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
  },
  { timestamps: true }
);

// THIS IS THE FIX:
// This line checks if the 'User' model already exists.
// If it does, it uses the existing model.
// If not, it creates a new one.
// This prevents the OverwriteModelError.
const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;