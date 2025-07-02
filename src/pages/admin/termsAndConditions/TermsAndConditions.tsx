import { Toaster } from 'sonner';
import TermsSubNavbar from '../../../components/admin/terms/TermsSubNavbar';
import SEO from '../../../middlewares/SEO';
import SkeletonTable from '../../../components/SkeletonTable';
import { useEffect, useState } from 'react';
import { adminFetchTermsAndConditions } from '../../../requests/termsAndConditionsRequests';
import { Link } from 'react-router-dom';
import { FaEdit } from 'react-icons/fa';
const TermsAndConditions = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any[]>([]);
  const [error, setError] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await adminFetchTermsAndConditions();
      if (response.status !== 200) {
        setError(response.message);
        return;
      }
      setData(response.data.terms);
    } catch (error: any) {
      setError('Failed to load terms and conditions. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  return (
    <div>
      <TermsSubNavbar />
      <SEO
        title="Terms and Conditions: Admin - Kickside Store"
        description="A page dedicated to managing terms and conditions for the app."
      />
      <Toaster richColors position="top-center" />
      <div className="container mx-auto p-6">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">
          Terms and Conditions
        </h2>
        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4">
            <p className="text-sm">{error}</p>
          </div>
        )}
        <div className="overflow-x-auto bg-white shadow-lg rounded-lg p-4">
          {loading ? (
            <SkeletonTable cols={3} rows={5} />
          ) : (
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-gray-200 text-gray-700">
                  <th className="p-3 text-left">#</th>
                  <th className="p-3 text-left">Version</th>
                  <th className="p-3 text-left">Title</th>
                  <th className="p-3 text-left">Category</th>
                  <th className="p-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.length > 0 ? (
                  data.map((row, index) => (
                    <tr
                      key={row._id}
                      className="border-b hover:bg-gray-100 transition duration-200"
                    >
                      <td className="p-3">{index + 1}</td>
                      <td className="p-3 text-gray-600">{row.version}</td>
                      <td className="p-3 text-gray-600">{row.title}</td>
                      <td className="p-3 text-gray-600">{row.type}</td>
                      <td className="p-3 text-gray-600">
                        <Link
                          to={`/admin/terms/update/${row.slug}`}
                          className="inline-flex items-center px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                        >
                          <FaEdit className="mr-1" /> Edit
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center p-3 text-gray-500">
                      No data found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
