import { useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

const PaymentPage = () => {
  const location = useLocation();
  const user = location.state?.user;
  console.log("user", user);

  const [amount, setAmount] = useState("");
  const [response, setResponse] = useState(null);
  const [error, setError] = useState("");

  // Function to verify payment and update status
  const verifyPayment = async (paymentData) => {
    try {console.log("paymentData",paymentData)
      const res = await axios.post("http://localhost:8081/api/payment/verify-payment", {
        razorpay_payment_id: paymentData.razorpay_payment_id,
        razorpay_order_id: paymentData.razorpay_order_id,
        razorpay_signature: paymentData.razorpay_signature,
        user_id: user._id,
        amount: amount
      });

      if (res.data.success) {
        alert("Payment verified and completed successfully!");
        setResponse(res.data.data);
      } else {
        alert("Payment verification failed!");
        setError("Payment verification failed");
      }
    } catch (err) {
      console.error("Payment verification error:", err);
      setError("Payment verification failed");
    }
  };

  const handlePayment = async () => {
    if (!amount || amount <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    try {
      const res = await axios.post("http://localhost:8081/api/payment/create-order", {
        amount: amount * 100, // Convert to paise for Razorpay
        user_id: user._id,
      });

      if (!res.data.success) {
        setError("Failed to create order");
        return;
      }

      const order = res.data.data;

      const options = {
        key: "rzp_test_NueE5rLaVF44Qs",
        amount: order.amount, // This is already in paise from backend
        currency: "INR",
        name: "Runr Pvt Ltd",
        description: "Test Transaction",
        image: "https://aalap.s3.amazonaws.com/alap/1750670557106_runr.jpg",
        order_id: order.id,
        handler: function (response) {
          // Verify payment after successful payment
          verifyPayment(response);
        },
        prefill: {
          name: user.name,
          email: user.email,
          contact: user.number,
        },
        notes: {
          address: "Gunjan's Office",
        },
        theme: {
          color: "#8b5cf6",
        },
        modal: {
          ondismiss: function() {
            // Handle payment cancellation
            console.log("Payment cancelled by user");
            setError("Payment was cancelled");
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {
      console.error("Payment error", err);
      setError("Something went wrong");
    }
  };

  if (!user) return <div>User info not found. Please register again.</div>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-600 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold mb-4 text-center">Welcome, {user.name}</h2>

        <label className="block mb-2 text-sm font-medium text-gray-700">
          Enter Amount to Pay (INR)
        </label>
        <input
          type="number"
          value={amount}
          onChange={(e) => {
            setAmount(e.target.value);
            setError(""); // Clear error when typing
          }}
          className="w-full px-4 py-2 border rounded-md mb-4"
          placeholder="Amount in INR (e.g., 232.32)"
          min="1"
          step="0.01"
        />

        <button
          onClick={handlePayment}
          disabled={!amount || amount <= 0}
          className="w-full py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Pay ₹{amount || 0}
        </button>

        {error && <div className="text-red-600 mt-4 text-sm">{error}</div>}

        {response && (
          <div className="mt-4 p-4 border rounded bg-green-50 text-green-700 text-sm">
            <p><strong>Payment Status:</strong> {response.status}</p>
            <p><strong>Amount Paid:</strong> ₹{amount}</p>
            <p><strong>Payment ID:</strong> {response.payment_id}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentPage;