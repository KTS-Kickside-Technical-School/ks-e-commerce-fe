import { useState, useEffect } from 'react';
import Footer from '../../../components/customers/Footer';
import Header from '../../../components/customers/Header';
import { getProfile } from '../../../utils/axios';
import { updateProfile } from '../../../requests/userRequests';
import { iUserProfile, Address } from '../../../types/store';
import ConfirmationModal from '../common/ConfirmationModal';
import { Toaster, toast } from 'sonner';
import {
  FaEdit,
  FaTrash,
  FaMapMarkerAlt,
  FaCheckCircle,
  FaPlus,
  FaUser,
  FaSignOutAlt,
} from 'react-icons/fa';
import { FiChevronDown } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const countries = [
  {
    code: 'CN',
    name: 'China',
    provinces: ['Beijing', 'Shanghai', 'Guangdong'],
  },
  { code: 'US', name: 'United States', provinces: ['California', 'New York'] },
];

const CustomerProfile = () => {
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
  const [editAddressIndex, setEditAddressIndex] = useState<number>(-1);
  const [newAddress, setNewAddress] = useState<Partial<Address>>({});
  const [showDeleteModal, setShowDeleteModal] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    setTempProfile({ ...profile });
  }, [profile]);

  const handleAddressSave = async () => {
    try {
      const isEditMode = editMode;
      const currentProfile = isEditMode ? tempProfile : profile;
      const updatedAddresses = [...(currentProfile.addresses || [])];
      const addressToSave: Address = {
        _id: newAddress._id || '',
        country: newAddress.country || '',
        region: newAddress.region || '',
        city: newAddress.city || '',
        street: newAddress.street || '',
        postalCode: newAddress.postalCode || '',
        isPrimary: newAddress.isPrimary || false,
      };

      if (editAddressIndex >= 0) {
        updatedAddresses[editAddressIndex] = addressToSave;
      } else {
        updatedAddresses.push(addressToSave);
      }
      if (!addressToSave.country || !addressToSave.region) {
        toast.error('Please select a country and province/state.');
        return;
      }

      if (addressToSave.isPrimary) {
        updatedAddresses.forEach((addr) => {
          addr.isPrimary = addr._id
            ? addr._id === addressToSave._id
            : addr.street === addressToSave.street &&
              addr.city === addressToSave.city &&
              addr.region === addressToSave.region &&
              addr.country === addressToSave.country &&
              addr.postalCode === addressToSave.postalCode;
        });
      }

      const updatePayload: iUserProfile = {
        ...(isEditMode ? tempProfile : profile),
        _id: profile._id,
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

      setNewAddress({});
      setEditAddressIndex(-1);
      toast.success('Address saved successfully!');
    } catch (error) {
      console.error(error);
      toast.error('Failed to save address');
    }
  };

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

  const handleProfileSave = async () => {
    try {
      const updated = await updateProfile(tempProfile);

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
  const logout = () => {
    sessionStorage.clear();
    toast.success('Logged out successfully!');
    setTimeout(() => {
      navigate('/');
    }, 1000);
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-8">
        <div className="max-w-4xl mx-auto px-4">
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
                    placeholder="+1 (555) 123-4567"
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
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-blue-100">
            <div className="flex flex-wrap justify-between items-center mb-8 gap-4">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-3">
                <FaMapMarkerAlt className="text-blue-600" />
                Shipping Addresses
              </h2>
              <button
                onClick={() => {
                  setNewAddress({
                    isPrimary: profile.addresses?.length === 0,
                    _id: Date.now().toString(),
                  });
                  setEditAddressIndex(-1);
                }}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white font-medium hover:from-blue-700 hover:to-blue-600 transition-all flex items-center gap-2"
              >
                <FaPlus />
                Add Address
              </button>
            </div>

            {/* Address Form */}
            {(editAddressIndex >= 0 || Object.keys(newAddress).length > 0) && (
              <div className="bg-blue-50 p-6 rounded-xl mb-8 border border-blue-200">
                <h3 className="text-lg font-semibold mb-6 text-blue-900 flex items-center gap-2">
                  <FaMapMarkerAlt />
                  {editAddressIndex >= 0 ? 'Edit Address' : 'New Address'}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Country <span className="text-blue-600">*</span>
                    </label>
                    <div className="relative">
                      <select
                        value={newAddress.country || ''}
                        onChange={(e) =>
                          setNewAddress({
                            ...newAddress,
                            country: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2.5 pr-10 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none transition-all"
                      >
                        <option value="">Select Country</option>
                        {countries.map((c) => (
                          <option key={c.code} value={c.code}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                      <FiChevronDown className="absolute right-3 top-3.5 text-gray-500 pointer-events-none" />
                    </div>
                  </div>
                  {newAddress.country && (
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Province/State <span className="text-blue-600">*</span>
                      </label>
                      <div className="relative">
                        <select
                          value={newAddress.region || ''}
                          onChange={(e) =>
                            setNewAddress({
                              ...newAddress,
                              region: e.target.value,
                            })
                          }
                          className="w-full px-4 py-2.5 pr-10 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none transition-all"
                        >
                          <option value="">Select Province</option>
                          {countries
                            .find((c) => c.code === newAddress.country)
                            ?.provinces.map((p) => (
                              <option key={p} value={p}>
                                {p}
                              </option>
                            ))}
                        </select>
                        <FiChevronDown className="absolute right-3 top-3.5 text-gray-500 pointer-events-none" />
                      </div>
                    </div>
                  )}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Street Address <span className="text-blue-600">*</span>
                    </label>
                    <input
                      type="text"
                      value={newAddress.street || ''}
                      onChange={(e) =>
                        setNewAddress({ ...newAddress, street: e.target.value })
                      }
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      placeholder="123 Main Street"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      City <span className="text-blue-600">*</span>
                    </label>
                    <input
                      type="text"
                      value={newAddress.city || ''}
                      onChange={(e) =>
                        setNewAddress({ ...newAddress, city: e.target.value })
                      }
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      placeholder="Enter city"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Postal Code <span className="text-blue-600">*</span>
                    </label>
                    <input
                      type="text"
                      value={newAddress.postalCode || ''}
                      onChange={(e) =>
                        setNewAddress({
                          ...newAddress,
                          postalCode: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      placeholder="Enter postal code"
                    />
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap justify-between items-center gap-4">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newAddress.isPrimary || false}
                      onChange={(e) =>
                        setNewAddress({
                          ...newAddress,
                          isPrimary: e.target.checked,
                        })
                      }
                      className="h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Set as primary address
                    </span>
                  </label>
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setNewAddress({});
                        setEditAddressIndex(-1);
                      }}
                      className="px-5 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 font-medium transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddressSave}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white font-medium hover:from-blue-700 hover:to-blue-600 transition-all"
                    >
                      Save Address
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(editMode ? tempProfile : profile)?.addresses?.map(
                (address, index) => (
                  <div
                    key={index}
                    className={`relative p-5 rounded-xl border-2 transition-all ${
                      address.isPrimary
                        ? 'border-blue-300 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-200'
                    }`}
                  >
                    {address.isPrimary && (
                      <div className="absolute top-3 right-3 bg-blue-600 text-white px-3 py-1 rounded-full text-xs flex items-center gap-2">
                        <FaCheckCircle className="text-sm" />
                        Primary
                      </div>
                    )}
                    <div className="space-y-2">
                      <h4 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                        <FaMapMarkerAlt className="text-blue-600" />
                        {address.street}
                      </h4>
                      <p className="text-gray-600">
                        {address.city}, {address.region}, {address.country}
                      </p>
                      <p className="text-gray-500 font-mono">
                        {address.postalCode}
                      </p>
                    </div>
                    <div className="absolute bottom-4 right-4 flex gap-2">
                      <button
                        onClick={() => {
                          setNewAddress(address);
                          setEditAddressIndex(index);
                        }}
                        className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                      >
                        <FaEdit className="text-lg" />
                      </button>
                      <button
                        onClick={() => setShowDeleteModal(index)}
                        className="p-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <FaTrash className="text-lg" />
                      </button>
                    </div>
                  </div>
                )
              )}
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
      <Footer />
    </>
  );
};

export default CustomerProfile;
