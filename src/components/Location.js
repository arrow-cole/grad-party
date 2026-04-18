import React, { useState } from 'react';

const Location = () => {
  const [modalOpen, setModalOpen] = useState(false);

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <>
      <button
        className="mr-4 py-2 px-4 rounded-lg bg-yellow-500 hover:bg-red-700 hover:text-white dark:hover:text-white text-black font-bolder dark:text-black"
        onClick={openModal}
      >
     Location 
      </button>

      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="relative max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg  p-4">
            <h2 className="text-2xl font-bold text-center mb-4 text-black dark:text-white">Location</h2>
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2 text-black dark:text-white">Westgate Bowl</h3>
                <p className="text-gray-700 dark:text-gray-300">4486 Alpine Ave NW</p>
                <p className="text-gray-700 dark:text-gray-300">Comstock Park, MI 49321</p>
            </div>
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2 text-black dark:text-white">Contact</h3>
              <p className="text-gray-700 dark:text-gray-300">Phone: +616 498-8680</p>
              <p className="text-gray-700 dark:text-gray-300">Email: graduation@aaronsgrad.us</p>
            </div>
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2 text-black dark:text-white">Map</h3>
              <div className="rounded-lg overflow-hidden">
                <iframe
                  title="Location Map"
                  src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d2915.814134553514!2d-85.6906999!3d43.045342!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8819a97ccc89ae41%3A0x59480f6bcfacad13!2sWestgate%20Bowl!5e0!3m2!1sen!2sus!4v1776551339059!5m2!1sen!2sus"
                  className="w-full h-64"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
            <div className="flex justify-center">
              <button
                className="bg-yellow-500 text-black py-2 px-4 rounded-lg"
                onClick={closeModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Location;
