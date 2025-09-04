import mongoose from 'mongoose';

const kycSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  phone: {
    type: String,
    required: true,
  },
  documentType: {
    type: String,
    enum: ['passport', 'nin'],
    required: true
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
      'selfEmployed',
      'employed',
      'govtWorker',
      'student',
      'expatriate',
      'politician',
      'clergyman',
      'imam',
      'business',
      'other',
    ],
    required: true,
  },
  specifyOccupation: {
    type: [String],
  },
  maritalStatus: {
    type: String,
    enum: ['Single', 'Married', 'Divorced', 'Widowed'],
    required: true,
  },
  spouseName: {
    type: String,
  },
  noOfChildren: {
    type: Number,
    default: 0,
  },
  religion: {
    type: String,
    enum: ['Christianity', 'Islam', 'Traditionalist', 'Other'],
    required: true,
  },
  companyName: {
    type: String,
    required: true,
  },
  companyAddress: {
    type: [String],
    required: true,
  },
  companyPhone: {
    type: String,
    required: true,
  },
  companyEmail: {
    type: String,
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
    
}, {timestamps: true}
);

const Kyc = mongoose.model('Kyc', kycSchema);
export default Kyc;
