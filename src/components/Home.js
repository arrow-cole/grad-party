import React from "react";
// import { useState } from "react";
import RSVPForm from "./RSVPForm";
import Location from "./Location";
import Donate from "./Donate";
import Facebook from "./Facebook"; // fixed import
import graduation from "../images/graduation.jpg";

const Home = () => {
  return (
    <div className="flex flex-col items-center bg-white dark:bg-gray-900 min-h-screen">
      <div className="mx-auto flex flex-col md:flex-row items-center py-8">
        <div className="md:w-1/2 relative -mt-10">
          <img
            src={graduation}
            alt="Graduation"
            className="w-96 h-4/5 rounded-t-full relative z-10 ml-10"
          />
          <div
            className="rounded-lg absolute top-2/4 left-2/4 transform -translate-x-2/4 -translate-y-2/4 bg-yellow-500 dark:bg-yellow-600 rounded-t-full w-96 h-4/5 mt-24 ml-8"
          />
        </div>

        <div className="md:w-2/3 py-8 md:py-0 m-4 text-center">
          <div className="flex flex-col justify-center h-full">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-4xl md:text-6xl sm:text-center text-center font-bold text-yellow-500 dark:text-yellow-600 sm:mt-8 mx-auto">
                Aaron's Graduation Invite
              </h1>
            </div>
            <div>
              <p className="text-lg mb-6 dark:text-white">
                This event marks a significant milestone in my life, and I would
                be honored if you could join me in celebrating this achievement
                on June 7th.
              </p>
              <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                <h2 className="text-2xl mx-auto text-center font-bold mb-4 text-red-700 dark:text-red-700">
                  Details of Graduation Party
                </h2>
                <p className="text-lg mb-4 sm:text-center">
                  I will be hosting an informal graduation party at Westgate Bowl, starting at 4.00 pm.
                </p>

                <p className="text-lg mb-4 sm:text-center">
                  Please note that drinks and snacks will be provided.
                </p>
                <p className="text-lg mb-4 sm:text-center">
                  To help with planning, I kindly request that you RSVP by June 1st. Your response will allow me to make adequate arrangements
                  for the event.
                </p>
              </div>
            </div>
            <div className="flex justify-center gap-4 flex-wrap items-center">
                <Location />
                <RSVPForm />
                <Donate />
                <div className="ml-6"> {/* adds extra space before Facebook */}
                <Facebook />
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;