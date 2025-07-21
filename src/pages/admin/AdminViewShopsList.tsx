import { useEffect, useState } from 'react';
import { toast, Toaster } from 'sonner';
import {
  FaChevronDown,
  FaChevronUp,
  FaMapMarkerAlt,
  FaCreditCard,
  FaUser,
  FaInfoCircle,
  FaRegClock,
} from 'react-icons/fa';
import SEO from '../../middlewares/SEO';
import {
  adminApproveShop,
  adminDisableShop,
  adminRejectShop,
  adminViewShopsList,
} from '../../requests/shopRequest';
import Logo from '/logo.png';
import SellersMgtSubNavbar from '../../components/admin/sellers/SellersMgtSubNavbar';
import SkeletonCard from '../../components/admin/sellers/SkeletonCard';
import ConfirmShopModal from '../../components/admin/sellers/ConfirmShopModal';
import ShopDocuments from '../../components/admin/shops/ShopsDocuments';

interface Shop {
  _id: string;
  name: string;
  isActive: boolean;
  isApproved: boolean;
  isWaitingForApproval: boolean;
  createdAt: string;
  logo?: string;
  description?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
  seller: {
    _id: string;
    fullNames: string;
    email: string;
    phone?: string;
    idDocument?: string;
  };
  payment?: {
    mobilePayment?: string;
    bankName?: string;
    accountNumber?: string;
  };
  rdbDocument?: string;
}

const AdminViewShopsList = () => {
  const [data, setData] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedShopId, setExpandedShopId] = useState<string | null>(null);
  const [modal, setModal] = useState<{
    type: 'approve' | 'reject';
    shopId: string;
    reason: string;
  } | null>(null);

  useEffect(() => {
    const fetchSellers = async () => {
      try {
        const response = await adminViewShopsList();
        if (response.status !== 200) {
          toast.error(response.message);
          return;
        }
        setData(response.data.shops);
      } catch (error) {
        toast.error('Error fetching sellers');
      } finally {
        setLoading(false);
      }
    };
    fetchSellers();
  }, []);

  const toggleExpand = (shopId: string) => {
    setExpandedShopId(expandedShopId === shopId ? null : shopId);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleApproveShop = async (shopId: string) => {
    try {
      const response = await adminApproveShop(shopId);
      if (response.status !== 200) {
        toast.error(response.message);
        return;
      }
      setData((prev) =>
        prev.map((shop) =>
          shop._id === shopId
            ? { ...shop, isApproved: true, isWaitingForApproval: false }
            : shop
        )
      );
      toast.success('Shop approved successfully');
      setModal(null);
    } catch (error) {
      toast.error('Failed to approve shop');
    }
  };

  const handleRejectShop = async (shopId: string, reason: string) => {
    if (!reason || reason.trim() === '') {
      toast.error('Please enter a reason for rejection');
      return;
    }

    try {
      const response = await adminRejectShop(shopId, reason);
      if (response.status !== 200) {
        toast.error(response.message);
        return;
      }

      setData((prev) =>
        prev.map((shop) =>
          shop._id === shopId ? { ...shop, isWaitingForApproval: false } : shop
        )
      );
      toast.success('Shop rejected successfully');
      setModal(null);
    } catch (error) {
      toast.error('Failed to reject shop');
    }
  };

  const handleDisableShop = async (shopId: string, reason: string) => {
    try {
      const response = await adminDisableShop(shopId, reason);
      if (response.status !== 200) {
        toast.error(response.message);
        return;
      }

      setData((prev) =>
        prev.map((shop) =>
          shop._id === shopId ? { ...shop, status: 'inactive' } : shop
        )
      );
      toast.success('Shop disabled successfully');
      setModal(null);
    } catch (error) {
      toast.error('Failed to disable shop');
    }
  };

  const ShopActions = ({ shop }: { shop: any }) => (
    <div className="flex gap-2">
      <button
        onClick={() => toggleExpand(shop._id)}
        className="p-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-600 transition duration-200 shadow-sm"
        title={
          expandedShopId === shop._id ? 'Collapse details' : 'View details'
        }
      >
        {expandedShopId === shop._id ? <FaChevronUp /> : <FaChevronDown />}
      </button>
    </div>
  );

  const ApprovalButtons = ({ shopId }: { shopId: string }) => (
    <div className="flex gap-3 mt-4">
      <button
        onClick={() => setModal({ type: 'approve', shopId, reason: '' })}
        className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors"
      >
        Approve Shop
      </button>
      <button
        onClick={() => setModal({ type: 'reject', shopId, reason: '' })}
        className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
      >
        Reject Shop
      </button>
    </div>
  );

  const ShopStatusBadges = ({ shop }: { shop: any }) => (
    <div className="grid grid-cols-3 gap-3">
      <div className="flex flex-col items-center p-3 bg-blue-50 rounded-lg">
        <span className="text-sm text-gray-500 mb-1">Active</span>
        <span
          className={`font-bold ${
            shop.status === 'active' ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {shop?.status}
        </span>
      </div>
      <div className="flex flex-col items-center p-3 bg-blue-50 rounded-lg">
        <span className="text-sm text-gray-500 mb-1">Approved</span>
        <span
          className={`font-bold ${
            shop.isApproved ? 'text-green-600' : 'text-amber-600'
          }`}
        >
          {shop.isApproved ? 'Yes' : 'No'}
        </span>
      </div>
      <div className="flex flex-col items-center p-3 bg-blue-50 rounded-lg">
        <span className="text-sm text-gray-500 mb-1">Pending</span>
        <span
          className={`font-bold ${
            shop.isWaitingForApproval ? 'text-amber-600' : 'text-gray-600'
          }`}
        >
          {shop.isWaitingForApproval ? 'Yes' : 'No'}
        </span>
      </div>
    </div>
  );

  return (
    <>
      <SEO
        title="Shop Management Dashboard: Admin - Kicside Store"
        description="Manage and monitor registered shops"
      />
      <Toaster richColors position="top-center" />

      <div className="container mx-auto p-4 md:p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              Shop Management
            </h1>
            <p className="text-gray-600 mt-1">
              Monitor and manage registered shops
            </p>
          </div>
          <div className="bg-blue-50 px-4 py-2 rounded-lg flex items-center">
            <FaInfoCircle className="text-blue-500 mr-2" />
            <span className="text-sm text-blue-700">
              {data.length} shops registered
            </span>
          </div>
        </div>

        <SellersMgtSubNavbar />

        <div className="mt-8">
          <div className="grid grid-cols-1 gap-6">
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
            ) : data.length > 0 ? (
              data.map((shop: any) => (
                <div
                  key={shop._id}
                  className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-xl"
                >
                  <div className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <img
                          src={shop?.logo || Logo}
                          alt={shop?.name || 'Shop logo'}
                          className="w-14 h-14 rounded-xl border-2 border-white shadow object-cover"
                        />
                        <div
                          className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white ${
                            shop.isActive ? 'bg-green-500' : 'bg-gray-400'
                          }`}
                        ></div>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3
                            className="font-bold text-gray-800 cursor-pointer hover:text-blue-600 transition duration-200"
                            onClick={() => toggleExpand(shop._id)}
                          >
                            {shop.name}
                          </h3>
                          {shop.isWaitingForApproval && (
                            <span className="px-2 py-1 bg-amber-100 text-amber-800 text-xs font-medium rounded-full">
                              Pending Approval
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <FaUser className="text-gray-400 text-sm" />
                          <span className="text-gray-600 text-sm">
                            {shop.seller.fullNames}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="hidden sm:block">
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <FaRegClock className="text-gray-400" />
                          <span>Created: {formatDate(shop.createdAt)}</span>
                        </div>
                      </div>
                      <ShopActions shop={shop} />
                    </div>
                  </div>

                  <div
                    className={`transition-all duration-500 ease-in-out overflow-hidden ${
                      expandedShopId === shop._id ? 'max-h-[1500px]' : 'max-h-0'
                    }`}
                  >
                    <div className="p-5 border-t border-gray-100 bg-gray-50">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                        <div className="space-y-5">
                          {shop.description && (
                            <div className="bg-white p-4 rounded-lg shadow-sm">
                              <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                <FaInfoCircle className="text-blue-500" />
                                Description
                              </h4>
                              <p className="text-gray-600">
                                {shop.description}
                              </p>
                            </div>
                          )}

                          <div className="bg-white p-4 rounded-lg shadow-sm">
                            <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                              <FaMapMarkerAlt className="text-green-500" />
                              Address
                            </h4>
                            {shop.address ? (
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                  <label className="text-xs text-gray-500">
                                    Street
                                  </label>
                                  <p className="font-medium">
                                    {shop.address.street}
                                  </p>
                                </div>
                                <div>
                                  <label className="text-xs text-gray-500">
                                    City
                                  </label>
                                  <p className="font-medium">
                                    {shop.address.city}
                                  </p>
                                </div>
                                <div>
                                  <label className="text-xs text-gray-500">
                                    State
                                  </label>
                                  <p className="font-medium">
                                    {shop.address.state}
                                  </p>
                                </div>
                                <div>
                                  <label className="text-xs text-gray-500">
                                    Postal Code
                                  </label>
                                  <p className="font-medium">
                                    {shop.address.postalCode}
                                  </p>
                                </div>
                                <div className="sm:col-span-2">
                                  <label className="text-xs text-gray-500">
                                    Country
                                  </label>
                                  <p className="font-medium">
                                    {shop.address.country}
                                  </p>
                                </div>
                              </div>
                            ) : (
                              <p className="text-gray-500 italic">
                                No address provided
                              </p>
                            )}
                          </div>

                          <div className="bg-white p-4 rounded-lg shadow-sm">
                            <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                              <FaUser className="text-purple-500" />
                              Seller Information
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div>
                                <label className="text-xs text-gray-500">
                                  Full Name
                                </label>
                                <p className="font-medium">
                                  {shop.seller.fullNames}
                                </p>
                              </div>
                              <div>
                                <label className="text-xs text-gray-500">
                                  Email
                                </label>
                                <p className="font-medium">
                                  {shop.seller.email}
                                </p>
                              </div>
                              <div>
                                <label className="text-xs text-gray-500">
                                  Phone
                                </label>
                                <p className="font-medium">
                                  {shop.seller.phone || 'N/A'}
                                </p>
                              </div>
                              <div>
                                <label className="text-xs text-gray-500">
                                  Seller ID
                                </label>
                                <p className="font-medium truncate">
                                  {shop.seller._id}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-5">
                          {shop.payment && (
                            <div className="bg-white p-4 rounded-lg shadow-sm">
                              <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                <FaCreditCard className="text-yellow-500" />
                                Payment Details
                              </h4>
                              <div className="space-y-3">
                                {shop.payment.mobilePayment && (
                                  <div>
                                    <label className="text-xs text-gray-500">
                                      Mobile Payment
                                    </label>
                                    <p className="font-medium">
                                      {shop.payment.mobilePayment}
                                    </p>
                                  </div>
                                )}
                                {shop.payment.bankName && (
                                  <div>
                                    <label className="text-xs text-gray-500">
                                      Bank
                                    </label>
                                    <p className="font-medium">
                                      {shop.payment.bankName}
                                    </p>
                                  </div>
                                )}
                                {shop.payment.accountNumber && (
                                  <div>
                                    <label className="text-xs text-gray-500">
                                      Account Number
                                    </label>
                                    <p className="font-medium">
                                      {shop.payment.accountNumber}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          {(shop.rdbDocument || shop.seller.idDocument) && (
                            <ShopDocuments shop={shop} />
                          )}

                          <div className="bg-white p-4 rounded-lg shadow-sm">
                            <h4 className="font-semibold text-gray-700 mb-3">
                              Shop Status
                            </h4>
                            <ShopStatusBadges shop={shop} />
                          </div>

                          {(shop.isWaitingForApproval ||
                            shop.status === 'rejected') && (
                            <ApprovalButtons shopId={shop._id} />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-16 bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-inner border border-dashed border-gray-200">
                <div className="flex justify-center mb-5">
                  <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
                </div>
                <h3 className="text-xl font-medium text-gray-700 mb-2">
                  No shops found
                </h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  There are currently no registered shops. Shops will appear
                  here once registered.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <ConfirmShopModal
        isOpen={modal !== null}
        type={modal?.type || null}
        shopId={modal?.shopId || ''}
        reason={modal?.reason || ''}
        onReasonChange={(reason) =>
          setModal((prev) => (prev ? { ...prev, reason } : null))
        }
        onApprove={handleApproveShop}
        onReject={handleRejectShop}
        onDisable={handleDisableShop}
        onClose={() => setModal(null)}
      />
    </>
  );
};

export default AdminViewShopsList;
