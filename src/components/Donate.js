// Donate.js
import React from "react";

function Donate() {
  const handleDonateClick = () => {
    // Replace with your donation link
    window.open("https://www.yourdonatelink.com", "_blank");
  };

  return (
    <button
      onClick={handleDonateClick}
      className="bg-yellow-500 text-black font-bolder py-2 px-4 rounded-lg hover:bg-red-700 hover:text-white transition-colors duration-300"
    >
      Donate
    </button>
  );
}

export default Donate;