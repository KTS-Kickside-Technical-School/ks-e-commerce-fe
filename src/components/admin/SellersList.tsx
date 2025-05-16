import { useEffect, useState } from 'react';
import { toast, Toaster } from 'sonner';
import { FaToggleOn, FaToggleOff, FaEllipsisV } from 'react-icons/fa';
import SEO from '../../middlewares/SEO';
import { adminViewSellers } from '../../requests/shopRequest';
import Avatar from '/Avatar.png';
import { FaShop } from 'react-icons/fa6';
import { Link } from 'react-router-dom';
import SkeletonTable from '../SkeletonTable';

const SellersList = () => {
  const [sellers, setSellers] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchSellers = async () => {
      try {
        const response = await adminViewSellers();
        if (response.status !== 200) {
          toast.error(response.message);
          return;
        }
        setSellers(response.data.users);
      } catch (error: any) {
        toast.error('Error fetching sellers');
      } finally {
        setLoading(false);
      }
    };
    fetchSellers();
  }, []);

  const toggleSellerStatus = (isActive: boolean) => {
    toast.success(`Seller ${isActive ? 'disabled' : 'enabled'} successfully`);
  };

  return (
    <>
      <SEO
        title="Admin View Sellers List"
        description="Admin can view and manage sellers."
      />
      <Toaster richColors position="top-center" />
      <div className="container mx-auto p-6">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">
          Sellers Management
        </h2>

        <div className="overflow-x-auto bg-white shadow-lg rounded-lg p-4">
          {loading ? (
            <SkeletonTable cols={3} rows={5} />
          ) : (
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-gray-200 text-gray-700">
                  <th className="p-3 text-left">#</th>
                  <th className="p-3 text-left">Profile</th>
                  <th className="p-3 text-left">Names</th>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-left">Phone</th>
                  <th className="p-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sellers.length > 0 ? (
                  sellers.map((seller, index) => (
                    <tr
                      key={seller._id}
                      className="border-b hover:bg-gray-100 transition duration-200"
                    >
                      <td className="p-3">{index + 1}</td>
                      <td className="p-3 font-medium">
                        <img
                          src={seller?.profilePicture || Avatar}
                          alt={seller?.fullNames || 'Seller Avatar'}
                          className="w-8 h-8 rounded-full border"
                        />
                      </td>
                      <td className="p-3 font-medium">{seller.fullNames}</td>
                      <td className="p-3 text-gray-600">{seller.email}</td>
                      <td className="p-3 text-gray-600">{seller.phone}</td>
                      <td className="p-3 flex justify-center space-x-3">
                        <button
                          onClick={() => toggleSellerStatus(seller.isActive)}
                          className={`p-2 rounded-md transition duration-200 ${
                            seller.isActive
                              ? 'bg-red-500 hover:bg-red-600'
                              : 'bg-green-500 hover:bg-green-600'
                          } text-white flex items-center`}
                        >
                          {seller.isActive ? <FaToggleOff /> : <FaToggleOn />}
                        </button>
                        <Link
                          to={`/admin/shop-details?sellerId=${seller._id}`}
                          className="p-2 rounded-md bg-blue-500 hover:bg-blue-600 text-white flex items-center transition duration-200"
                        >
                          <FaShop className="mr-1" />
                        </Link>
                        <button className="p-2 rounded-md bg-gray-500 hover:bg-gray-600 text-white flex items-center transition duration-200">
                          <FaEllipsisV />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center p-3 text-gray-500">
                      No sellers found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
};

export default SellersList;
