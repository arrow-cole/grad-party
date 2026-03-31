import React from 'react';
import { useState, useEffect } from "react";


function Navbar() {

    const [theme, setTheme] = useState("dark");

    // get the current theme from localStorage
    useEffect(() => {
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        setTheme("dark");
      } else {
        setTheme("light");
      }
    }, []);
  
    // manually set the theme to dark
    useEffect(() => {
      if (theme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }, [theme]);
  
    const toggleDarkMode = () => {
      setTheme(theme === "light" ? "dark" : "light");
    };
 

  return (
    <div className="flex justify-between items-center py-4 px-8">
      <h1 className="text-3xl sm:text-center text-purple-700 dark:text-white">
      </h1>
      <button onClick={toggleDarkMode} className="w-20 rounded-lg  bg-black dark:bg-white dark p-1">
      {theme === "dark" ? "🌞" : "🌙"}
      </button>
    </div>
  );

// return (
//     <div className="flex flex-col items-center bg-white dark:bg-gray-900 min-h-screen">
//       <div className="container mx-auto flex flex-col md:flex-row items-center py-8">
//         <div className="md:w-1/2 relative">
//           <img
//             src="https://images.unsplash.com/photo-1675714203232-683124186564?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=753&q=80"
//             alt="Image"
//             className="w-96 rounded-lg relative z-10"
//           />
//           <div className="rounded-lg absolute top-2/4 left-2/4 transform -translate-x-2/4 -translate-y-2/4 bg-gray-200 dark:bg-gray-800 w-96 h-96" />
//         </div>
//         <div className="md:w-1/2 bg-gray-200 dark:bg-gray-800 py-8 md:py-0">
//           <div className="flex flex-col justify-center h-full">
//             <div className="flex justify-between items-center mb-6">
//               <h1 className="text-4xl md:text-6xl text-center font-bold text-black dark:text-white">
//                 Welcome to My Website
//               </h1>
//               <button
//                 onClick={toggleDarkMode}
//                 className="w-10 h-10 rounded-full bg-black dark:bg-white p-1"
//               >
//                 {theme === 'dark' ? '🌞' : '🌙'}
//               </button>
//             </div>
//             <div className="flex justify-center mb-8">
//               <button
//                 className={`mr-4 py-2 px-4 rounded-lg ${
//                   activeTab === 'location' ? 'bg-purple-700 text-white' : 'bg-gray-400 text-black dark:text-white'
//                 }`}
//                 onClick={() => handleTabClick('location')}
//               >
//                 Location
//               </button>
//               <button
//                 className={`mr-4 py-2 px-4 rounded-lg ${
//                   activeTab === 'rsvp' ? 'bg-purple-700 text-white' : 'bg-gray-400 text-black dark:text-white'
//                 }`}
//                 onClick={() => handleTabClick('rsvp')}
//               >
//                 RSVP
//               </button>
//             </div>
//             {activeTab === 'location' && (
//               <div className="text-center">
//                 <h2 className="text-2xl font-bold mb-4">Location</h2>
//                 <p className="text-lg">
//                   Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis fringilla risus nibh, vitae dictum odio gravida vitae.
//                 </p>
//               </div>
//             )}
//             {activeTab === 'rsvp' && (
//               <div className="text-center">
//                 <h2 className="text-2xl font-bold mb-4">RSVP</h2>
//                 <p className="text-lg">
//                   Please fill out the form below to RSVP to the event.
//                 </p>
//                 {/* Add your RSVP form here */}
//               </div>
//             )}
//           </div>
//         </div>
//         </div>
//     </div>
//     );

}

export default Navbar;