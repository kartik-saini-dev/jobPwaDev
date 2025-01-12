import mongoose from 'mongoose';
import {User} from "./user"

const OrderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  tier: { type: String, required: true },
  price: { type: Number, required: true },
  credits: {
    type: Number,
    default: 0, // Initial credit is 0
    min: 0, // Prevent negative credits
  },
  isCompleted: { type: Boolean, default: false },
  razorpayOrderId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});


const Order = mongoose.models.Order || mongoose.model("Order", OrderSchema);
export default Order;
