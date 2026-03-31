// Facebook.js
import React from "react";

function Facebook() {
  const handleFacebookClick = () => {
    // Replace with your Facebook event link
    window.open("https://facebook.com/events/s/aarons-grad-party/1294565449253656/", "_blank");
  };

  return (
    <button
      onClick={handleFacebookClick}
      className="bg-yellow-500 text-black font-bolder py-2 px-4 rounded-lg hover:bg-red-700 hover:text-white transition-colors duration-300"
    >
      Facebook Event
    </button>
  );
}

export default Facebook;