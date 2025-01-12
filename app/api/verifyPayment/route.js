import { NextResponse } from 'next/server';
import crypto from 'crypto';
import connectToDb from '@/database';
import Order from '@/models/orders';
import {User} from '@/models/user';

export async function POST(req) {
   
  try {

    await connectToDb();
    const body = await req.json();
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = body;

    // Security Check: Verify Razorpay Signature
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json(
        { success: false, message: 'Payment verification failed' },
        { status: 422 }
      );
    }

    // Update the order status in the database
    const order = await Order.findOneAndUpdate(
      { razorpayOrderId: razorpay_order_id },
      { isCompleted: true },
      { new: true }
    );

    if (!order) {
      return NextResponse.json(
        { success: false, message: 'Order not found' },
        { status: 404 }
      );
    }

    // Increment user credits
    const user = await User.findById(order.userId);
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    // Assuming `credits` field exists in the Order schema
    user.credits += order.credits;
    await user.save();

    // Send success response
    return NextResponse.json({
      success: true,
      message: 'Payment verified successfully',
      order,
      user: {
        id: user._id,
        credits: user.credits,
      },
    });
  } catch (error) {
    console.error('[verifyPayment]', error);
    return NextResponse.json(
      { success: false, message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
