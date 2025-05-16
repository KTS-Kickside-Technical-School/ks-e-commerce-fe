import { FaUserAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Logo from '/logo.png';

const DashboardHeader = ({ sideBarToggle }: { sideBarToggle: () => void }) => {
  return (
    <header className="bg-primary text-white shadow-lg px-4 py-3 sm:p-4 flex items-center justify-between z-10">
      <div className="flex items-center gap-2 sm:gap-4">
        <button
          onClick={sideBarToggle}
          className="md:hidden p-1.5 hover:bg-secondary rounded-lg"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        <h1 className="text-xl sm:text-2xl font-bold flex">
          <img src={Logo} className="w-8 h-8 bg-white mr-3" />
          <span>E-Commerce</span>
        </h1>
      </div>

      <div className="flex items-center gap-3 sm:gap-6">
        <div className="hidden sm:flex items-center gap-2 bg-blue-500 py-2 px-3 sm:px-4 rounded-lg">
          <span className="text-sm sm:text-base ">300k RWF</span>
          <svg
            className="w-4 h-4 sm:w-5 sm:h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
            />
          </svg>
        </div>

        <button className="p-1.5 sm:p-2 hover:bg-secondary rounded-full">
          <svg
            className="w-5 h-5 sm:w-6 sm:h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
        </button>

        <Link
          to={'/dashboard/profile'}
          className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-blue-500 flex items-center justify-center"
        >
          <span className="text-xs sm:text-sm">
            <FaUserAlt />
          </span>
        </Link>
      </div>
    </header>
  );
};

export default DashboardHeader;
