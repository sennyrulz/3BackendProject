import mongoose from 'mongoose';

const checkOutSchema = new mongoose.Schema({
  contact: {
    email: { 
        type: String, 
        required: true 
    },
    subscribe: { 
        type: Boolean, 
        default: false 
    },
  },

  delivery: {
    country: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    address: { type: String, required: true },
    apartment: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String },
    phone: { type: String, required: true },
  },

  shippingMethod: {
    type: String,
    enum: ['Standard Shipping', 'One-Day Shipping', 'Express Shipping'],
    required: true,
  },

  shippingCost: { type: Number, required: true },

  payment: {
    method: { 
        type: String, default: 
        'Paystack' 
    },
    status: { 
        type: String, 
        enum: ['Pending', 'Paid', 'Failed'], 
        default: 'Pending' 
    },
  },

  billingAddress: {
    sameAsShipping: { type: Boolean, default: true },
    country: { type: String },
    firstName: { type: String },
    lastName: { type: String },
    address: { type: String },
    apartment: { type: String },
    city: { type: String },
    state: { type: String },
    postalCode: { type: String },
    phone: { type: String },
  },

  products: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      name: String,
      size: String,
      quantity: { type: Number, default: 1 },
      price: Number,
    }
  ],
  
  discountCode: String,

  subtotal: { 
    type: Number, 
    required: true 
  },

  total: { 
    type: Number, 
    required: true 
  },
    // tax: { type: Number, default: 0 },

  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

}, { timestamps: true });

const Checkout = mongoose.model('Checkout', checkOutSchema);
export default Checkout;
