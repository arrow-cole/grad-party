import React, { useState } from "react";

function Donate() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="bg-yellow-500 text-black font-bolder py-2 px-4 rounded-lg hover:bg-red-700 hover:text-white transition-colors duration-300"
      >
        Donate
      </button>

      {open && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="absolute inset-0 bg-black opacity-50"
            onClick={() => setOpen(false)}
          ></div>
          <div className="relative max-w-md w-full mx-4 bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
            <div className="flex justify-end mb-2">
              <button
                onClick={() => setOpen(false)}
                className="bg-yellow-500 text-black py-1 px-3 rounded-lg hover:bg-red-700 hover:text-white text-sm"
              >
                Close
              </button>
            </div>
            <h2 className="text-xl font-bold text-center text-gray-900 dark:text-white mb-2">
              Support Aaron's Graduation
            </h2>
            <p className="text-center text-gray-500 dark:text-gray-400 text-sm mb-6">
              Thank you for your generosity! Here's how you can send a gift:
            </p>

            <div className="space-y-4">
              <div className="bg-green-50 dark:bg-gray-700 rounded-xl p-5 flex flex-col items-center">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Square_Cash_app_logo.svg/120px-Square_Cash_app_logo.svg.png"
                  alt="Cash App"
                  className="h-12 mb-3"
                />
                <p className="text-gray-700 dark:text-gray-200 font-medium mb-1">Send via Cash App</p>
                <p className="text-2xl font-bold text-green-600 tracking-wide">$acolebowl</p>
              </div>

              <div className="bg-yellow-50 dark:bg-gray-700 rounded-xl p-5 flex flex-col items-center text-center">
                <p className="text-gray-700 dark:text-gray-200 font-medium mb-1">Cash or Check</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                  Email me for a mailing address:
                </p>
                <a
                  href="mailto:graduation@aaronsgrad.us"
                  className="text-red-700 font-semibold hover:underline"
                >
                  graduation@aaronsgrad.us
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Donate;
