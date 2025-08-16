import { useState } from 'react';
import {
  FaCheckCircle,
  FaEdit,
  FaShoppingBag,
  FaSignOutAlt,
  FaUser,
} from 'react-icons/fa';
import { updateProfile } from '../../../requests/userRequests';
import { toast, Toaster } from 'sonner';
import { iUserProfile } from '../../../types/store';
import { getProfile } from '../../../utils/axios';
import { FiExternalLink } from 'react-icons/fi';
import ConfirmationModal from '../../customers/common/ConfirmationModal';
import { Link, useNavigate } from 'react-router-dom';

const Profile = () => {
  const [profile, setProfile] = useState<iUserProfile>(() => {
    const savedProfile = getProfile();
    try {
      const parsed = savedProfile ? JSON.parse(savedProfile) : {};
      return { ...parsed, addresses: parsed.addresses || [] };
    } catch (error) {
      return { addresses: [] };
    }
  });
  const [editMode, setEditMode] = useState(false);
  const [tempProfile, setTempProfile] = useState<iUserProfile>({ ...profile });
  const navigate = useNavigate();

  const handleProfileSave = async () => {
    try {
      console.log('Saving profile:', tempProfile);
      const updated = await updateProfile(tempProfile);
      console.log(updated.message);

      const { password, ...userWithoutPassword } = updated.data.updatedUser;
      sessionStorage.setItem('profile', JSON.stringify(userWithoutPassword));

      setProfile(updated.data.updatedUser);
      setEditMode(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error(error);
      toast.error('Failed to update profile');
    }
  };

  const [showDeleteModal, setShowDeleteModal] = useState<number | null>(null);
  const handleDeleteAddress = async (index: number) => {
    try {
      const isEditMode = editMode;
      const currentProfile = isEditMode ? tempProfile : profile;

      const updatedAddresses =
        currentProfile.addresses?.filter((_, i) => i !== index) || [];
      const updatePayload: iUserProfile = {
        ...currentProfile,
        addresses: updatedAddresses,
      };

      const updated = await updateProfile(updatePayload);
      const { password, ...userWithoutPassword } = updated.data.updatedUser;
      sessionStorage.setItem('profile', JSON.stringify(userWithoutPassword));

      if (isEditMode) {
        setTempProfile((prev) => ({
          ...prev,
          addresses: updated.data.updatedUser.addresses,
        }));
      } else {
        setProfile(updated.data.updatedUser);
      }

      setShowDeleteModal(null);
      toast.success('Address deleted successfully!');
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete address');
    }
  };
  const logout = () => {
    sessionStorage.clear();
    toast.success('Logged out successfully!');
    setTimeout(() => {
      navigate('/');
    }, 1000);
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-8">
        <div className="max-w-4xl mx-auto px-4">
          {tempProfile?.role === 'seller' && (
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-blue-100 transition-all hover:shadow-md">
              <Link
                to={'/seller/my-shop'}
                className="w-full flex items-center justify-between gap-4 group"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-50 rounded-xl border border-blue-100">
                    <FaShoppingBag className="w-6 h-6 text-blue-600 transition-transform group-hover:scale-110" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-800">
                    Visit my shop
                  </h2>
                </div>
                <FiExternalLink className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
              </Link>
            </div>
          )}

          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-blue-100">
            <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
              <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                <span className="">
                  <FaUser className="text-blue-600" />
                </span>
                Profile Information
              </h1>
              <div className="flex gap-3">
                {editMode ? (
                  <>
                    <button
                      onClick={handleProfileSave}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white font-medium hover:from-blue-700 hover:to-blue-600 transition-all flex items-center gap-2"
                      disabled={!tempProfile.fullNames?.trim()}
                    >
                      <FaCheckCircle className="text-lg" />
                      Save Changes
                    </button>
                    <button
                      onClick={() => setEditMode(false)}
                      className="px-5 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 font-medium transition-all"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setEditMode(true)}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white font-medium hover:from-blue-700 hover:to-blue-600 transition-all flex items-center gap-2"
                  >
                    <FaEdit className="text-lg" />
                    Edit Profile
                  </button>
                )}
              </div>
            </div>

            <div className="space-y-5">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Full Name{' '}
                  {editMode && <span className="text-blue-600">*</span>}
                </label>
                {editMode ? (
                  <input
                    value={tempProfile.fullNames || ''}
                    onChange={(e) =>
                      setTempProfile({
                        ...tempProfile,
                        fullNames: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                ) : (
                  <p className="text-gray-800 font-medium">
                    {profile?.fullNames || 'Not provided'}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <p className="text-gray-800 font-medium">{profile?.email}</p>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Phone
                </label>
                {editMode ? (
                  <input
                    value={tempProfile.phone || ''}
                    onChange={(e) =>
                      setTempProfile({ ...tempProfile, phone: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="+250 (780) 123-4567"
                  />
                ) : (
                  <p className="text-gray-800 font-medium">
                    {profile?.phone || 'Not provided'}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Bio
                </label>
                {editMode ? (
                  <textarea
                    value={tempProfile.bio || ''}
                    onChange={(e) =>
                      setTempProfile({ ...tempProfile, bio: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all h-32"
                    placeholder="Tell us about yourself..."
                  />
                ) : (
                  <p className="text-gray-600 italic">
                    {profile?.bio || 'No bio provided'}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-blue-100">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <FaSignOutAlt className="text-primary-500" />
                Account Security
              </h3>

              <p className="text-sm text-gray-600">
                Securely end your session. You'll need to sign in again to
                access your account.
              </p>

              <div className="mt-4 flex items-center gap-4 justify-between">
                <div className="flex-1">
                  <p className="text-sm text-gray-500">
                    Logged in as:{' '}
                    <span className="font-medium text-gray-700">
                      {profile.email}
                    </span>
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Last session: {new Date().toLocaleDateString()}
                  </p>
                </div>

                <button
                  onClick={logout}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-lg transition-colors bg-red-600 hover:bg-red-700 text-white group"
                  aria-label="Sign out of account"
                >
                  <FaSignOutAlt className="transition-transform group-hover:scale-110" />
                  <span className="font-medium">End Session</span>
                </button>
              </div>

              <p className="text-xs text-gray-400 mt-4">
                Concerned about activity?
                <button
                  className="ml-2 text-red-600 hover:underline focus:outline-none"
                  onClick={() => navigate('/security-settings')}
                >
                  Review recent account activity
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={showDeleteModal !== null}
        onClose={() => setShowDeleteModal(null)}
        onConfirm={() => handleDeleteAddress(showDeleteModal!)}
        title="Delete Address"
        message="Are you sure you want to delete this address?"
      />

      <Toaster position="top-center" richColors />
    </>
  );
};

export default Profile;
