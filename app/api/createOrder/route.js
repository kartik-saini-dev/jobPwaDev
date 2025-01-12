import Razorpay from 'razorpay';
import { NextResponse } from 'next/server';
import connectToDb from '@/database'; // Utility to connect to MongoDB
import Order from '../../../models/orders'; // Import the Order Schema

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

export async function POST(req) {


  try {
    await connectToDb(); // Ensure the database connection
    const body = await req.json();
    const { amount, userId, tier ,credits} = body;
   
    // Validate request body
    if (!amount || !userId || !tier || !credits) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create Razorpay Order
    const orderOptions = {
      amount: amount * 100, // Convert amount to paise
      currency: 'INR', // Assuming currency is INR
      receipt: `order_${Date.now()}`,
      payment_capture: 1,
    };

    const razorpayOrder = await razorpay.orders.create(orderOptions);

    // Save the order in the database
    const newOrder = new Order({
      userId,
      tier,
      credits,
      price: amount,
      razorpayOrderId: razorpayOrder.id,
      isCompleted: false, // Initially set to false
    });

    await newOrder.save();

    // Send response
    return NextResponse.json({
      success: true,
   
        razorpayOrderId: razorpayOrder.id,
        price: newOrder.price,

    });
  } catch (error) {
    console.error('[createOrder]', error);
    return NextResponse.json(
      { success: false, message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
