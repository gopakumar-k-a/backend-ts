import mongoose, { Document, Schema } from 'mongoose';

interface IUser extends Document {
  name: string;
  address: string;
  gender: 'male' | 'female' | 'other'; // Strict typing for gender
  userName: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'], // Custom error message
      trim: true,
    },
    address: {
      type: String,
      required: [true, 'Address is required'], // Custom error message
      trim: true,
    },
    gender: {
      type: String,
      required: [true, 'Gender is required'], // Custom error message
      enum: {
        values: ['male', 'female', 'other'],
        message: 'Gender must be male, female, or other',
      },
    },
    userName: {
      type: String,
      required: [true, 'Username is required'],
      unique: true, // Enforces uniqueness
      trim: true,
      minlength: [3, 'Username must be at least 3 characters long'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters long'],
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

// Export the model
export const User = mongoose.model<IUser>('User', userSchema);
