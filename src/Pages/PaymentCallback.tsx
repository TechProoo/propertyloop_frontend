import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import paymentsService from "../api/services/payments";
import { CheckCircle, XCircle, Loader } from "lucide-react";

const PaymentCallback: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "failure">("loading");
  const [jobId, setJobId] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    const verifyPayment = async () => {
      const reference = searchParams.get("reference");

      if (!reference) {
        setStatus("failure");
        setErrorMessage("No payment reference found");
        return;
      }

      try {
        const result = await paymentsService.verifyPayment(reference);
        setJobId(result.jobId);

        if (result.escrowStatus === "LOCKED") {
          setStatus("success");
        } else {
          setStatus("failure");
          setErrorMessage(`Payment verification failed. Status: ${result.escrowStatus}`);
        }
      } catch (error) {
        setStatus("failure");
        setErrorMessage(
          error instanceof Error ? error.message : "Payment verification failed"
        );
      }
    };

    verifyPayment();
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        {status === "loading" && (
          <div className="flex flex-col items-center justify-center space-y-4">
            <Loader className="w-12 h-12 text-blue-600 animate-spin" />
            <h1 className="text-xl font-semibold text-gray-900">Verifying Payment</h1>
            <p className="text-gray-600 text-center">
              Please wait while we confirm your payment...
            </p>
          </div>
        )}

        {status === "success" && (
          <div className="flex flex-col items-center justify-center space-y-4">
            <CheckCircle className="w-16 h-16 text-green-600" />
            <h1 className="text-2xl font-bold text-gray-900">Payment Confirmed!</h1>
            <p className="text-gray-600 text-center">
              Your payment has been successfully received and is being held in escrow.
              Your vendor will be in touch shortly to discuss the job details.
            </p>
            <button
              onClick={() => navigate("/dashboard")}
              className="w-full bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700 transition"
            >
              Go to Dashboard
            </button>
          </div>
        )}

        {status === "failure" && (
          <div className="flex flex-col items-center justify-center space-y-4">
            <XCircle className="w-16 h-16 text-red-600" />
            <h1 className="text-2xl font-bold text-gray-900">Payment Failed</h1>
            <p className="text-gray-600 text-center">
              {errorMessage || "Your payment could not be processed. Please try again."}
            </p>
            <div className="flex gap-3 w-full">
              <button
                onClick={() => navigate("/dashboard")}
                className="flex-1 bg-gray-300 text-gray-900 py-2 px-4 rounded-lg font-medium hover:bg-gray-400 transition"
              >
                Go Back
              </button>
              <button
                onClick={() => {
                  if (jobId) {
                    navigate(`/book-service?jobId=${jobId}`);
                  } else {
                    navigate("/");
                  }
                }}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition"
              >
                Retry
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentCallback;
