import { useState, useEffect } from 'react';
import { FaEdit, FaSave, FaTimes, FaCheckCircle } from 'react-icons/fa';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { updateProfile } from '../../../requests/userRequests';
import { iUserProfile, Address } from '../../../types/store';
import { Link } from 'react-router-dom';

interface ClearCartProps {
  onClose: () => void;
  onConfirm: () => void;
  profile: iUserProfile;
  setProfile: (profile: iUserProfile) => void;
}

const PayNowConfirmAddress = ({
  onClose,
  onConfirm,
  profile,
  setProfile,
}: ClearCartProps) => {
  const primaryAddress =
    profile.addresses?.find((addr) => addr.isPrimary) || profile.addresses?.[0];
  const [isEditing, setIsEditing] = useState(false);
  const [tempAddress, setTempAddress] = useState<Address>(
    primaryAddress || ({} as Address)
  );
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (primaryAddress) {
      setTempAddress(primaryAddress);
    }
  }, [primaryAddress]);

  const handleSave = async () => {
    if (
      !tempAddress.country ||
      !tempAddress.city ||
      !tempAddress.street ||
      !tempAddress.postalCode
    ) {
      toast.error('Please fill all required address fields');
      return;
    }

    try {
      setIsSaving(true);

      const updatedAddress: Address = {
        ...primaryAddress,
        ...tempAddress,
        _id: primaryAddress?._id || uuidv4(),
        isPrimary: true,
      };

      const updatedAddresses = profile.addresses?.map((addr) =>
        addr.isPrimary ? updatedAddress : addr
      ) || [updatedAddress];

      const optimisticProfile = {
        ...profile,
        addresses: updatedAddresses,
      };
      setProfile(optimisticProfile);

      const updatedProfile = await updateProfile(optimisticProfile);

      setProfile(updatedProfile.data.updatedUser);

      const { password, ...userWithoutPassword } =
        updatedProfile.data.updatedUser;

      sessionStorage.setItem('profile', JSON.stringify(userWithoutPassword));

      setIsEditing(false);
      toast.success('Address updated successfully');
    } catch (error) {
      setProfile(profile);
      toast.error('Failed to update address');
    } finally {
      setIsSaving(false);
    }
  };

  if (!primaryAddress) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-md">
        <div className="bg-gradient-to-b from-white to-white/50 rounded-2xl p-8 max-w-md w-full shadow-2xl animate-slide-up border border-gray-100">
          <div className="text-center space-y-5">
            <div className="flex justify-center">
              <span className="p-3 bg-red-50 rounded-full text-red-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-8 h-8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                  />
                </svg>
              </span>
            </div>

            <h3 className="text-2xl font-bold text-gray-800 tracking-tight">
              Shipping Address Required
            </h3>

            <p className="text-gray-600 mb-4 leading-relaxed">
              We need a delivery location to process your order. Please add a
              valid shipping address to proceed with secure payment.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={onClose}
                className="px-5 py-2.5 text-gray-600 hover:text-gray-800 font-medium rounded-lg transition-colors"
              >
                Cancel
              </button>

              <Link
                onClick={onClose}
                to={'/my-account'}
                className="px-5 py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors inline-flex items-center justify-center gap-2 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4.5v15m7.5-7.5h-15"
                  />
                </svg>
                Add New Address
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl animate-slide-up">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-semibold text-gray-900">
            Shipping Address Confirmation
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        {isEditing ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Country <span className="text-red-500">*</span>
                </label>
                <input
                  value={tempAddress.country}
                  onChange={(e) =>
                    setTempAddress({ ...tempAddress, country: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  value={tempAddress.city}
                  onChange={(e) =>
                    setTempAddress({ ...tempAddress, city: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Street Address <span className="text-red-500">*</span>
              </label>
              <input
                value={tempAddress.street}
                onChange={(e) =>
                  setTempAddress({ ...tempAddress, street: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Postal Code <span className="text-red-500">*</span>
                </label>
                <input
                  value={tempAddress.postalCode}
                  onChange={(e) =>
                    setTempAddress({
                      ...tempAddress,
                      postalCode: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Region/State
                </label>
                <input
                  value={tempAddress.region || ''}
                  onChange={(e) =>
                    setTempAddress({ ...tempAddress, region: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg flex items-center gap-2"
              >
                <FaTimes /> Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50"
              >
                <FaSave /> {isSaving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="space-y-3 mb-6">
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <p className="font-medium text-gray-900">
                  {primaryAddress.street}
                </p>
                <p className="text-gray-600">
                  {primaryAddress.city}, {primaryAddress.region}
                </p>
                <p className="text-gray-600">
                  {primaryAddress.country} {primaryAddress.postalCode}
                </p>
                <span className="inline-flex items-center mt-2 text-sm text-green-600">
                  <FaCheckCircle className="mr-1.5 h-4 w-4" />
                  Primary Shipping Address
                </span>
              </div>

              <button
                onClick={() => setIsEditing(true)}
                className="text-blue-600 hover:text-blue-700 flex items-center gap-2 text-sm"
              >
                <FaEdit /> Edit Address
              </button>
            </div>

            <div className="flex justify-end gap-3 border-t pt-4">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Continue to Payment
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PayNowConfirmAddress;
