"use client";

import { useEffect, useContext } from "react";
import { FaDollarSign, FaRegCreditCard } from "react-icons/fa";
import { GlobalContext } from "@/context";
import { handleRazorpayPayment } from "@/lib/razorpayUtils";
import axios from "axios";
import { useRouter } from "next/navigation";

import { Toaster, toast } from "sonner";

const Checkout = () => {

  const router = useRouter();
  const { checkoutData ,user ,isPaymentProcessing, setIsPaymentProcessing,setPageLevelLoader} = useContext(GlobalContext);
    //please dont refresh the page
  const { price:totalAmount, credits ,tier }  = checkoutData;


  useEffect(()=>{

  setPageLevelLoader(false);

  },[]);

  const handlePayment = () => {
    setIsPaymentProcessing(true); // Set loading state to true when payment starts
             
      //before clicking chekout must login 
    handleRazorpayPayment(
      totalAmount,
      credits,
      {userId : user._id},
      tier,
      async (response) => {
     
        toast.success("Payment was successful!");

        try {
          const verifyResponse = await axios.post("/api/verifyPayment", {
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
          });

          if (verifyResponse.data.success) {

            router.push(`/user/${user?._id}`);
          } else {
            toast.error("Payment verification failed. Please try again.");
          }
        } catch (error) {
          console.error("Error verifying payment:", error);
          toast.error("Something went wrong. Please try again.");
        } finally {
          setIsPaymentProcessing(false); // Set loading state to false after payment verification
        }
      },
      () => {
        toast.error("Payment failed. Please try again.");
        setIsPaymentProcessing(false); // Set loading state to false if payment fails
      },
      setIsPaymentProcessing
    );
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-6 font-sans"
    style={{ backgroundImage: "url('/lines.jpg')" }}>
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
        {/* Header */}
        <h2 className="text-4xl font-extrabold mb-8 text-center text-gray-800">
          <div className="flex items-center justify-center space-x-2">
            <FaDollarSign className="text-green-500" />
            <span>Checkout</span>
          </div>
        </h2>

        {/* Plan Details */}
        <div className="space-y-6 mb-8">
          <div className="flex justify-between items-center p-5 bg-blue-50 rounded-xl shadow-md hover:shadow-lg transition">
            <span className="text-lg font-semibold text-gray-700">Credits:</span>
            <span className="text-lg font-bold text-blue-600">{credits}</span>
          </div>
          <div className="flex justify-between items-center p-5 bg-blue-50 rounded-xl shadow-md hover:shadow-lg transition">
            <span className="text-lg font-semibold text-gray-700">Total Amount:</span>
            <span className="text-lg font-extrabold text-gray-800">
              <FaDollarSign className="inline text-blue-600" /> {totalAmount}
            </span>
          </div>
        </div>

        {/* Payment Button */}
        <button
          onClick={handlePayment}
          disabled={isPaymentProcessing}
          className={`w-full py-4 text-lg font-semibold rounded-xl transition transform duration-300 ease-in-out ${
            isPaymentProcessing
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:scale-105 hover:shadow-xl"
          }`}
        >
          {isPaymentProcessing ? (
            <span className="animate-pulse">Processing...</span>
          ) : (
            <div className="flex items-center justify-center space-x-3">
              <FaRegCreditCard className="text-white" />
              <span>Pay Securely with Razorpay</span>
            </div>
          )}
        </button>
      </div>
      <Toaster richColors />
    </div>
  );
};

export default Checkout;
