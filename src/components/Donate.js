import React, { useState } from "react";

function Donate() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="bg-yellow-500 text-black font-bolder py-2 px-4 rounded-lg hover:bg-red-700 hover:text-white transition-colors duration-300"
      >
        Info
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
            <h2 className="text-xl font-bold text-center text-gray-900 dark:text-white mb-4">
              Event Information
            </h2>
            <div className="text-gray-700 dark:text-gray-300 space-y-3 text-sm">
              <div>
                <p className="font-semibold text-red-700">Date & Time</p>
                <p>June 7th, starting at 4:00 PM</p>
              </div>
              <div>
                <p className="font-semibold text-red-700">Location</p>
                <p>Westgate Bowl</p>
              </div>
              <div>
                <p className="font-semibold text-red-700">Food & Drinks</p>
                <p>Drinks and snacks will be provided.</p>
              </div>
              <div>
                <p className="font-semibold text-red-700">Contact</p>
                <p>graduation@aaroncole.dev</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Donate;
