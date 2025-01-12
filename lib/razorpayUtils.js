import axios from "axios";

export const handleRazorpayPayment = async (amount, credits, {userId},tier, onSuccess, onFailure, setIsPaymentProcessing) => {
    
  try {
    // Request Razorpay order from backend
    const response = await axios.post("/api/createOrder", { amount, credits , userId,tier});
    const order = response.data;
     
    if (order && order. razorpayOrderId) {
      // Load Razorpay script
      if (!window.Razorpay) {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () =>
          initializeRazorpay(order, onSuccess, onFailure, setIsPaymentProcessing, credits);
        script.onerror = () => {
          console.error("Failed to load Razorpay script");
          setIsPaymentProcessing(false);
          onFailure && onFailure();
        };
        document.body.appendChild(script);
      } else {
        initializeRazorpay(order, onSuccess, onFailure, setIsPaymentProcessing, credits,tier);
      }
    }
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    setIsPaymentProcessing(false);
    onFailure && onFailure();
  }
};

const initializeRazorpay = (order, onSuccess, onFailure, setIsPaymentProcessing, credits,tier) => {
  const options = {
    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "test_key", // Fallback for undefined
    amount: order.price,
    order_id: order. razorpayOrderId,
    name: "Code to Cart",
    description: "Payment for Subscription",
    image: "/your-logo.png",
    handler: (response) => onSuccess && onSuccess(response),
    prefill: {
      name: "Your Name", // Replace with dynamic user data
      email: "user@example.com",
      contact: "1234567890",
    },
    notes: {
      website: "Your Website",
      credits: credits,
      tier:tier,
    },
    theme: {
      color: "#F37254",
    },
    modal: {
      ondismiss: () => {
       
        setIsPaymentProcessing(false);
        onFailure && onFailure();
      },
    },
  };

  const razorpay = new window.Razorpay(options);
  razorpay.open();
};
