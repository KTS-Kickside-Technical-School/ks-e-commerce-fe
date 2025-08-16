import { useEffect, useState, Fragment } from 'react';
import { toast, Toaster } from 'sonner';
import { FaToggleOn, FaToggleOff } from 'react-icons/fa';
import SEO from '../../middlewares/SEO';
import { adminViewUsers } from '../../requests/shopRequest';
import Avatar from '/Avatar.png';
import SellersMgtSubNavbar from '../../components/admin/sellers/SellersMgtSubNavbar';
import { adminDisableUser, adminChangeUserRole } from '../../requests/userRequests';
import SkeletonTable from '../../components/SkeletonTable';
import { Dialog, Transition } from '@headlessui/react';

const UsersList = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showModal, setShowModal] = useState(false);
  const [reason, setReason] = useState('');
  const [targetUser, setTargetUser] = useState<{ id: string; status: boolean } | null>(null);
  const [roleModal, setRoleModal] = useState(false);
  const [roleTarget, setRoleTarget] = useState<{ id: string; newRole: string } | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await adminViewUsers();
        if (response.status !== 200) {
          toast.error(response.message);
          return;
        }
        setData(response.data.users);
      } catch (error: any) {
        toast.error('Error fetching users');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleDisable = (userId: string, currentStatus: boolean) => {
    if (!currentStatus) {
      setTargetUser({ id: userId, status: currentStatus });
      setShowModal(true);
    } else {
      toggleUserStatus(userId, currentStatus);
    }
  };

  const toggleUserStatus = async (userId: string, currentStatus: boolean, disableReason = '') => {
    try {
      const response = await adminDisableUser(userId, !currentStatus, disableReason);
      if (response.status !== 200) {
        toast.error(response.message);
        return;
      }
      setData(prev =>
        prev.map(user => (user._id === userId ? { ...user, isDisabled: !currentStatus } : user))
      );
      toast.success(`User ${!currentStatus ? 'disabled' : 'enabled'} successfully`);
    } catch (error) {
      toast.error('Error toggling user status');
    } finally {
      setShowModal(false);
      setReason('');
      setTargetUser(null);
    }
  };

  const confirmDisable = () => {
    if (!reason.trim()) {
      toast.error('Reason is required to disable the user.');
      return;
    }
    if (targetUser) {
      toggleUserStatus(targetUser.id, targetUser.status, reason);
    }
  };

  const handleChangeRoleModal = (userId: string, newRole: string) => {
    setRoleTarget({ id: userId, newRole });
    setRoleModal(true);
  };

  const confirmChangeRole = async () => {
    if (!roleTarget) return;
    try {
      const response = await adminChangeUserRole(roleTarget.id, roleTarget.newRole);
      if (response.status !== 200) {
        toast.error(response.message);
        return;
      }
      setData(prev =>
        prev.map(user => (user._id === roleTarget.id ? { ...user, role: roleTarget.newRole } : user))
      );
      toast.success('User role updated');
    } catch (error) {
      toast.error('Error changing role');
    } finally {
      setRoleModal(false);
      setRoleTarget(null);
    }
  };

  return (
    <>
      <SEO title="View Users List: Admin - Kickside Shop" description="Admin can view and manage users." />
      <Toaster richColors position="top-center" />
      <div className="container mx-auto p-6">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">Users Management</h2>
        <SellersMgtSubNavbar />
        <div className="overflow-x-auto bg-white shadow-lg rounded-lg p-4">
          {loading ? (
            <SkeletonTable cols={7} rows={5} />
          ) : (
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-gray-200 text-gray-700">
                  <th className="p-3 text-left">#</th>
                  <th className="p-3 text-left">Profile</th>
                  <th className="p-3 text-left">Names</th>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-left">Phone</th>
                  <th className="p-3 text-left">Role</th>
                  <th className="p-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.length > 0 ? (
                  data.map((user, index) => (
                    <tr key={user._id} className="border-b hover:bg-gray-100 transition duration-200">
                      <td className="p-3">{index + 1}</td>
                      <td className="p-3 font-medium">
                        <img src={user?.profilePicture || Avatar} alt={user?.fullNames || 'User Avatar'} className="w-8 h-8 rounded-full border" />
                      </td>
                      <td className="p-3 font-medium">{user.fullNames}</td>
                      <td className="p-3 text-gray-600">{user.email}</td>
                      <td className="p-3 text-gray-600">{user.phone}</td>
                      <td className="p-3">
                        <select
                          value={user.role}
                          onChange={(e) => handleChangeRoleModal(user._id, e.target.value)}
                          className="border rounded px-2 py-1 bg-white shadow-sm"
                        >
                          <option value="customer">Customer</option>
                          <option value="seller">Seller</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td className="p-3 flex justify-center">
                        <button
                          onClick={() => handleDisable(user._id, user.isDisabled)}
                          className={`p-2 rounded-md transition duration-200 flex items-center text-white ${
                            user.isDisabled ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
                          }`}
                        >
                          {user.isDisabled ? <FaToggleOff /> : <FaToggleOn />}
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="text-center p-3 text-gray-500">
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modal for disable reason */}
      <Transition appear show={showModal} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setShowModal(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                    Disable User
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Please provide a reason for disabling this user:
                    </p>
                    <textarea
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      className="mt-3 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                      rows={4}
                      placeholder="Enter reason here..."
                    />
                  </div>
                  <div className="mt-4 flex justify-end space-x-3">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowModal(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                      onClick={confirmDisable}
                    >
                      Confirm
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Modal for role change confirmation */}
      <Transition appear show={roleModal} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setRoleModal(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                    Confirm Role Change
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Are you sure you want to change this user's role to <strong>{roleTarget?.newRole}</strong>?
                    </p>
                  </div>
                  <div className="mt-4 flex justify-end space-x-3">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                      onClick={() => setRoleModal(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                      onClick={confirmChangeRole}
                    >
                      Confirm
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default UsersList;
