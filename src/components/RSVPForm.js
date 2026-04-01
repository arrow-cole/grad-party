import React, { useState } from "react";
import Swal from "sweetalert2";

const RsvpForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [attendance, setAttendance] = useState("yes");
  const [modalOpen, setModalOpen] = useState(false);

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          attendance,
        }),
      });

      if (res.ok) {
        Swal.fire({
          icon: "success",
          title: "Thank you for RSVPing!",
          text: "Your response has been recorded.",
        });

        setName("");
        setEmail("");
        setAttendance("yes");
        closeModal();
      } else {
        throw new Error();
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Something went wrong",
        text: "Please try again later.",
      });
    }
  };

  return (
    <>
      <button
        className="bg-yellow-500 text-black font-bolder mr-4 py-2 px-4 rounded-lg hover:bg-red-700 hover:text-white"
        onClick={openModal}
      >
        RSVP
      </button>

      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black opacity-50"></div>

          <div className="relative max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-10">
            <div className="flex justify-end">
              <button
                className="bg-yellow-500 text-black py-2 px-4 rounded-lg mb-4 hover:bg-red-700 hover:text-white"
                onClick={closeModal}
              >
                Close
              </button>
            </div>

            <div className="text-center">
              <p className="text-lg text-gray-900 mb-4 dark:text-white">
                Please fill out the form to RSVP to the event.
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <label className="block text-sm font-medium text-gray-900 dark:text-gray-300">
                Name:
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mb-4 p-2 rounded-md border border-gray-400 w-full"
                required
              />

              <label className="block text-sm font-medium text-gray-900 dark:text-gray-300">
                Email:
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mb-4 p-2 rounded-md border border-gray-400 w-full"
                required
              />

              <label className="block text-sm font-medium text-gray-900 dark:text-gray-300">
                Will you be attending?
              </label>
              <select
                value={attendance}
                onChange={(e) => setAttendance(e.target.value)}
                className="mb-4 p-2 rounded-md border border-gray-400 w-full"
              >
                <option value="yes">Yes</option>
                <option value="maybe">Interested</option>
                <option value="no">No</option>
              </select>

              <div className="flex justify-center">
                <button
                  type="submit"
                  className="px-8 py-3 rounded-md bg-red-700 text-white font-bold hover:bg-yellow-500 transition duration-300"
                >
                  RSVP
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default RsvpForm;