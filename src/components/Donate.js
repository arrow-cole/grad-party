import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import Swal from "sweetalert2";

function CheckoutForm({ amount, onSuccess, onClose }) {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.href,
      },
      redirect: "if_required",
    });

    if (error) {
      Swal.fire({ icon: "error", title: "Payment failed", text: error.message });
      setProcessing(false);
    } else {
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <p className="text-center text-gray-700 dark:text-gray-200 mb-4 font-medium">
        Donating <span className="text-yellow-500 font-bold">${amount}</span>
      </p>
      <PaymentElement />
      <div className="flex gap-2 mt-6">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 py-2 px-4 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!stripe || processing}
          className="flex-1 py-2 px-4 rounded-lg bg-yellow-500 text-black font-bold hover:bg-red-700 hover:text-white disabled:opacity-50"
        >
          {processing ? "Processing..." : `Donate $${amount}`}
        </button>
      </div>
    </form>
  );
}

function Donate() {
  const [stripePromise, setStripePromise] = useState(null);
  const [modalStep, setModalStep] = useState(null); // null | 'amount' | 'payment'
  const [amount, setAmount] = useState("");
  const [clientSecret, setClientSecret] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/donate/config")
      .then((r) => r.json())
      .then(({ publishableKey }) => {
        if (publishableKey) setStripePromise(loadStripe(publishableKey));
      })
      .catch(() => {});
  }, []);

  const handleAmountSubmit = async (e) => {
    e.preventDefault();
    const parsed = parseFloat(amount);
    if (!parsed || parsed < 1) {
      Swal.fire({ icon: "warning", title: "Invalid amount", text: "Please enter at least $1." });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/donate/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: parsed }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create payment");
      setClientSecret(data.clientSecret);
      setModalStep("payment");
    } catch (err) {
      Swal.fire({ icon: "error", title: "Something went wrong", text: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleSuccess = () => {
    setModalStep(null);
    setAmount("");
    setClientSecret(null);
    Swal.fire({
      icon: "success",
      title: "Thank you!",
      text: "Your donation is much appreciated. Congrats Aaron!",
    });
  };

  const handleClose = () => {
    setModalStep(null);
    setAmount("");
    setClientSecret(null);
  };

  return (
    <>
      <button
        onClick={() => setModalStep("amount")}
        className="bg-yellow-500 text-black font-bolder py-2 px-4 rounded-lg hover:bg-red-700 hover:text-white transition-colors duration-300"
      >
        Donate
      </button>

      {modalStep && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black opacity-50" onClick={handleClose}></div>
          <div className="relative max-w-md w-full mx-4 bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
            <div className="flex justify-end mb-2">
              <button
                onClick={handleClose}
                className="bg-yellow-500 text-black py-1 px-3 rounded-lg hover:bg-red-700 hover:text-white text-sm"
              >
                Close
              </button>
            </div>

            {modalStep === "amount" && (
              <>
                <h2 className="text-xl font-bold text-center text-gray-900 dark:text-white mb-4">
                  Support Aaron's Graduation
                </h2>
                <form onSubmit={handleAmountSubmit}>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Donation Amount ($)
                  </label>
                  <div className="flex gap-2 mb-4">
                    {["5", "10", "25", "50"].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setAmount(preset)}
                        className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-colors ${
                          amount === preset
                            ? "bg-yellow-500 text-black border-yellow-500"
                            : "border-gray-300 text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        ${preset}
                      </button>
                    ))}
                  </div>
                  <input
                    type="number"
                    min="1"
                    step="0.01"
                    placeholder="Or enter custom amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full p-2 rounded-md border border-gray-400 mb-4"
                    required
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-md bg-red-700 text-white font-bold hover:bg-yellow-500 hover:text-black transition duration-300 disabled:opacity-50"
                  >
                    {loading ? "Loading..." : "Continue to Payment"}
                  </button>
                </form>
              </>
            )}

            {modalStep === "payment" && clientSecret && stripePromise && (
              <>
                <h2 className="text-xl font-bold text-center text-gray-900 dark:text-white mb-4">
                  Payment Details
                </h2>
                <Elements stripe={stripePromise} options={{ clientSecret }}>
                  <CheckoutForm
                    amount={parseFloat(amount).toFixed(2)}
                    onSuccess={handleSuccess}
                    onClose={handleClose}
                  />
                </Elements>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default Donate;
