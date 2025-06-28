import { FaLocationCrosshairs } from 'react-icons/fa6';
import { Link } from 'react-router-dom';

interface SystemInformationSubNavBarProps {}
const SystemInformationSubNavBar = ({}: SystemInformationSubNavBarProps) => {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4 text-gray-700">
        System information
      </h2>
      <nav className="p-3 rounded-lg shadow-md flex items-center gap-4">
        <Link
          to="/admin/locations"
          className="bg-primary-500 hover:bg-primary-500-dark text-white px-4 py-2 rounded flex items-center gap-2 transition"
        >
          <FaLocationCrosshairs />
          Locations
        </Link>
      </nav>
    </div>
  );
};

export default SystemInformationSubNavBar;
