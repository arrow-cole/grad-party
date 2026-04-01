const Footer = () => {
  return (
    <footer className="bottom-0 w-full bg-red-700 dark:bg-yellow-500 py-4 px-8 flex flex-col items-center justify-center sm:flex-row sm:justify-between">
      <p className="text-white text-sm sm:text-md dark:text-black dark:font-bolder mb-2 sm:mb-0">
        &copy; 2026 Aaron Cole's Graduation Invite. 
      </p>
      <p className="text-white text-sm sm:text-md dark:text-black dark:font-bolder mb-2 sm:mb-0">
        All Rights Reserved.
      </p>
      
      <div className="flex items-center space-x-4">
        <p className="text-white text-sm sm:text-md dark:text-black dark:font-bolder">RSVP to:</p>
        <a
          href="mailto:graduation@aaronsgrad.org"
          className="text-white text-sm sm:text-md font-medium hover:text-yellow-500 dark:text-black dark:font-bolder dark:hover:text-red-700"
        >
          graduation@grad.acole.te
        </a>
      </div>
    </footer>
  );
};

export default Footer;
