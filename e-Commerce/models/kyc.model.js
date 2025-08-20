import mongoose from 'mongoose';

const kycSchema = new mongoose.Schema({
  phone: {
    type: String,
    required: true,
  },
  documentType: {
    type: String,
    required: true,
    enum: ['passport', 'nin'],
  },
  idNumber: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  gender: {
    type: String,
    enum: ['Male', 'Female'],
  },
  age: {
    type: String,
    required: true,
  },
  occupation: {
    type: String,
    enum: [
      'Self Employed',
      'Employed',
      'Govt Worker',
      'Student',
      'Expatriate',
      'Politician',
      'ClergyMan',
      'Imam',
      'Business',
    ],
    required: true,
  },
  companyName: {
    type: String,
    required: true,
  },
  companyAddress: {
    type: String,
    required: true,
  },
  companyPhone: {
    type: String,
    required: true,
  },
  companyEmail: {
    type: String,
    required: true,
  },
  currentHomeAddress: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  zipCode: {
    type: String,
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  submittedAt: {
    type: Date,
    default: Date.now,
  },
});

const kycModel = mongoose.model('Kyc', kycSchema);
export default kycModel;
