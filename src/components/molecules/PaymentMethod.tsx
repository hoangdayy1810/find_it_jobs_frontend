import React from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useTranslations } from "next-intl";

interface IPaymentMethod {
  handlePaymentSuccess: (details: any) => void;
  handlePaymentError: (error: any) => void;
  handlePaymentCancel: () => void;
  onCancel: () => void;
  t: any;
}

const PaymentMethod = ({
  handlePaymentSuccess,
  handlePaymentError,
  handlePaymentCancel,
  onCancel,
  t: propT,
}: IPaymentMethod) => {
  // Get default translations if not passed as prop
  const defaultT = useTranslations();
  const t = propT || defaultT;

  // Options Paypal
  const options = {
    clientId:
      "AWa7Z_Uj81NjV36f1oB9aw3GWj7ab0ztxnqBbuUAa044LNRcowbZNVR6SmMO_oMcdy4DYx3Qbd2ZHQdc",
    currency: "USD",
    intent: "capture",
    "disable-funding": "card",
  };

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">{t("payment.modal.title")}</h2>
        <p className="mb-4">{t("payment.modal.description")}</p>

        <PayPalScriptProvider options={options}>
          <PayPalButtons
            style={{ layout: "vertical" }}
            createOrder={(data, actions) => {
              return actions.order.create({
                intent: "CAPTURE",
                purchase_units: [
                  {
                    amount: {
                      currency_code: "USD",
                      value: "2",
                    },
                  },
                ],
              });
            }}
            onApprove={async (data, actions) => {
              if (actions.order) {
                try {
                  const details = await actions.order.capture();
                  await handlePaymentSuccess(details);
                } catch (error) {
                  handlePaymentError(error);
                }
              } else {
                // If actions.order is undefined, just resolve the promise
                return Promise.resolve();
              }
            }}
            onError={handlePaymentError}
            onCancel={handlePaymentCancel}
          />
        </PayPalScriptProvider>

        <button
          className="mt-4 w-full py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          onClick={onCancel}
        >
          {t("payment.modal.cancel")}
        </button>
      </div>
    </div>
  );
};

export default PaymentMethod;
