
import mongoose, { Schema, Document } from 'mongoose';

interface IFormData extends Document {
  text: string;
  email: string;
  password: string;
  date: string;
  number: string;
  checkbox: boolean;
  radio: string;
  textarea: string;
  select: string;
  files: string[]; 
}

const formDataSchema = new Schema<IFormData>({
  text: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  date: { type: String, required: true },
  number: { type: String, required: true },
  checkbox: { type: Boolean, required: true },
  radio: { type: String, required: true },
  textarea: { type: String, required: true },
  select: { type: String, required: true },
  files: { type: [String], required: true },
});

const FormData = mongoose.model<IFormData>('FormData', formDataSchema);

export default FormData;
