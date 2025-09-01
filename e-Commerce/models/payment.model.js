import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  reference: { 
    type: String, 
    required: true, 
    unique: true 
  },
    
  totalAmount: { 
    type: Number, 
    required: true 
  },

  paymentMethod: { 
    type: String, 
    default: 'paystack' 
  }, // Default to 'paystack'
    
  currency: { type: String, default: 'USD' }, // Default to Nigerian USD
    
  transactionId: { type: String, unique: true },

  status: { 
    type: String, 
    enum: ["pending", "success", "failed"], 
    default: "pending" 
  }, // Default to 'pending'

  paidAt: { type: Date },

  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  checkout: { type: mongoose.Schema.Types.ObjectId, ref: 'Checkout' },

}, { timestamps: true });

const Payment = mongoose.model("Payment", paymentSchema);
export default Payment;
