import { useEffect, useMemo, useState } from 'react';
import {
  FaStore,
  FaPhone,
  FaImage,
  FaClock,
  FaMapMarkerAlt,
  FaRegEdit,
  FaRegSave,
} from 'react-icons/fa';
import { MdDescription } from 'react-icons/md';
import {
  sellerGetShopDetails,
  sellerUpdateShop,
} from '../../../requests/shopRequest';
import Logo from '/logo.png';
import uploadToCloudinary from '../../../helpers/cloudinary';
import { toast } from 'sonner';
import { getAllLocations } from '../../../requests/locationRequests';
import { IUpdateShop } from '../../../types/store';

const isImage = (file: File) => file.type.startsWith('image/');

const MyShop = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [shopData, setShopData] = useState<IUpdateShop>({
    _id: '',
    name: '',
    description: '',
    logo: Logo,
    images: [] as string[],
    phone: '',
    createdAt: new Date(),
    updatedAt: new Date(),
    address: {
      street: '',
      city: '',
      postalCode: '',
      country: '',
      state: '',
    },
    __v: '',
    seller: '',
  });
  const [newLogo, setNewLogo] = useState<File | null>(null);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [locations, setLocations] = useState<any[]>([]);

  useEffect(() => {
    const fetchShopData = async () => {
      try {
        setIsLoading(true);
        const response = await sellerGetShopDetails();
        setShopData(response.data.shop);
      } catch (error) {
        toast.error('Error fetching shop data');
        console.error('Error fetching shop data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchLocation = async () => {
      try {
        const response = await getAllLocations();
        if (response.status === 200) {
          setLocations(response.data.locations || []);
        }
      } catch (error) {
        console.error('Error fetching locations:', error);
      }
    };
    fetchLocation();
    fetchShopData();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setShopData((prev: any) => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value,
        },
      }));
    } else {
      setShopData((prev: any) => ({ ...prev, [name]: value }));
    }

    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSave = async () => {
    const newErrors: Record<string, string> = {};

    if (!shopData?.name.trim()) newErrors.name = 'Name is required';
    if (!shopData?.description.trim())
      newErrors.description = 'Description is required';
    if (!shopData?.phone?.trim()) newErrors.phone = 'Phone is required';
    if (shopData?.description?.trim().length >= 500)
      newErrors.description = 'Description should be less than 500 characters';

    const requiredAddressFields = [
      'street',
      'city',
      'postalCode',
      'country',
      'state',
    ];
    requiredAddressFields.forEach((field: any) => {
      if (!shopData?.address?.[field]?.trim()) {
        newErrors[`address.${field}`] = `${
          field[0].toUpperCase() + field.slice(1)
        } is required`;
      }
    });

    const totalImages = shopData.images.length + newImages.length;
    if (totalImages < 3) newErrors.images = 'At least 3 images are required';
    if (totalImages > 10) newErrors.images = 'Maximum 10 images are allowed';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error('Please fix validation errors.');
      return;
    }

    try {
      setIsSaving(true);

      let logoUrl = shopData.logo;
      if (newLogo) {
        logoUrl = await uploadToCloudinary(newLogo);
      }

      const uploadedImages = await Promise.all(
        newImages.map(uploadToCloudinary)
      );


      const updatedData = {
        name: shopData.name.trim(),
        description: shopData.description.trim(),
        phone: shopData.phone.trim(),
        logo: logoUrl,
        images: [...shopData.images, ...uploadedImages],
        address: {
          street: shopData.address.street.trim(),
          city: shopData.address.city.trim(),
          postalCode: shopData.address.postalCode.trim(),
          country: shopData.address.country.trim(),
          state: shopData.address.state.trim(),
        },
      };
      const response = await sellerUpdateShop(updatedData);
      if (response.status === 200) {
        setShopData(response.data.shop);
        setNewImages([]);
        setNewLogo(null);
        setImagePreviews([]);
        toast.success('Shop updated successfully!');
      } else {
        toast.error('Failed to update shop, please try again later.');
        console.error('Update failed:', response);
      }
    } catch (error) {
      console.error('Update failed:', error);
      toast.error('Update failed, please try again later.');
    } finally {
      setIsSaving(false);
      setIsEditing(false);
    }
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setNewLogo(file);
      setShopData((prev: any) => ({
        ...prev,
        logo: URL.createObjectURL(file),
      }));
    }
  };

  const handleRemoveExistingImage = (index: any) => {
    const updatedImages = [...shopData.images];
    updatedImages.splice(index, 1);
    setShopData({ ...shopData, images: updatedImages });
  };

  const handleRemovePreview = (index: any) => {
    const updatedPreviews = [...imagePreviews];
    updatedPreviews.splice(index, 1);
    setImagePreviews(updatedPreviews);
  };
  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const files = Array.from(e.target.files).filter(isImage);

    if (shopData.images.length + newImages.length + files.length > 10) {
      toast.error('You can upload a maximum of 10 images in total.');
      return;
    }

    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setNewImages((prev) => [...prev, ...files]);
    setImagePreviews((prev) => [...prev, ...newPreviews]);
  };

  useEffect(() => {
    return () => {
      imagePreviews.forEach((preview) => URL.revokeObjectURL(preview));
    };
  }, [imagePreviews]);

  const uniqueCities = useMemo(() => {
    const cityMap = new Map<string, string>();
    locations.forEach((loc) => {
      if (loc.city && typeof loc.city === 'string') {
        const trimmed = loc.city.trim();
        if (trimmed) {
          const lower = trimmed.toLowerCase();
          if (!cityMap.has(lower)) {
            cityMap.set(lower, trimmed);
          }
        }
      }
    });
    return Array.from(cityMap.values());
  }, [locations]);

  const uniqueCountries = useMemo(() => {
    const countryMap = new Map<string, string>();
    locations.forEach((loc) => {
      if (loc.country && typeof loc.country === 'string') {
        const trimmed = loc.country.trim();
        if (trimmed) {
          const lower = trimmed.toLowerCase();
          if (!countryMap.has(lower)) {
            countryMap.set(lower, trimmed);
          }
        }
      }
    });
    return Array.from(countryMap.values());
  }, [locations]);

  if (isLoading) {
    return (
      <div className="w-full h-96 flex justify-center items-center">
        <p className="text-lg text-primary-500 font-semibold">Loading...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 border border-primary-100">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-primary-500 flex items-center gap-3">
            <FaStore className="text-xl sm:text-2xl" />
            {isEditing ? (
              <input
                type="text"
                name="name"
                value={shopData?.name || ''}
                onChange={handleInputChange}
                className={`border-b-2 border-primary-500 focus:outline-none w-full ${
                  errors.name ? 'border-red-500' : ''
                }`}
              />
            ) : (
              shopData.name
            )}
          </h1>
          <button
            onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
            disabled={isSaving}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors w-full sm:w-auto justify-center ${
              isEditing
                ? 'bg-green-500 hover:bg-green-600 text-white'
                : 'bg-primary-100 hover:bg-primary-200 text-primary-700'
            } ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isSaving ? (
              <div className="flex items-center gap-2">
                <svg
                  className="animate-spin h-5 w-5 text-current"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span>Saving...</span>
              </div>
            ) : isEditing ? (
              <div className="flex items-center gap-2">
                <FaRegSave />
                <span>Save changes</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <FaRegEdit />
                <span>Edit Shop</span>
              </div>
            )}
          </button>
        </div>
        {errors.name && <p className="text-red-500 mb-2">{errors.name}</p>}

        <div className="mb-8 flex flex-col sm:flex-row items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
            <img
              src={shopData.logo}
              alt="Shop logo"
              className="w-full h-full rounded-full object-cover"
            />
          </div>
          {isEditing && (
            <div className="relative">
              <input
                type="file"
                id="logoUpload"
                accept="image/*"
                onChange={handleLogoChange}
                className="hidden"
              />
              <label
                htmlFor="logoUpload"
                className="flex flex-col sm:flex-row items-center gap-2 cursor-pointer text-primary-500 hover:text-primary-600 transition-colors group"
              >
                <div className="p-2 bg-primary-100 rounded-lg group-hover:bg-primary-200 transition-colors">
                  <FaImage className="text-lg" />
                </div>
                <div className="text-center sm:text-left">
                  <span className="font-medium">Upload Logo</span>
                  <span className="block text-sm text-gray-400">
                    (JPEG, PNG, max 5MB)
                  </span>
                </div>
              </label>
            </div>
          )}
        </div>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4 text-primary-500">
            <MdDescription className="text-xl" />
            <h3 className="text-lg font-semibold">Description</h3>
          </div>
          {isEditing ? (
            <>
              <textarea
                name="description"
                value={shopData.description}
                onChange={handleInputChange}
                className={`w-full p-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-colors ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
                rows={8}
                placeholder="Tell your customers about your shop. What makes it special?"
              />
              <div className="flex justify-between items-start mt-2 text-sm">
                <p
                  className={`pr-4 ${
                    errors.description || shopData.description.length > 500
                      ? 'text-red-600'
                      : 'text-gray-500'
                  }`}
                >
                  {errors.description
                    ? errors.description
                    : 'Description must not exceed 500 characters.'}
                </p>
                <p
                  className={`font-medium whitespace-nowrap pl-4 ${
                    shopData.description.length > 500
                      ? 'text-red-600'
                      : 'text-green-600'
                  }`}
                >
                  {shopData.description.length}
                </p>
              </div>
            </>
          ) : (
            <p className="text-gray-600 prose">{shopData.description}</p>
          )}
        </div>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4 text-primary-500">
            <FaPhone className="text-xl" />
            <h3 className="text-lg font-semibold">Contact Information</h3>
          </div>
          {isEditing ? (
            <>
              <input
                type="tel"
                name="phone"
                value={shopData.phone}
                onChange={handleInputChange}
                className={`w-full p-3 border-2 border-primary-100 rounded-lg focus:border-primary-500 focus:outline-none ${
                  errors.phone ? 'border-red-500' : ''
                }`}
              />
              {errors.phone && (
                <p className="text-red-500 mt-2">{errors.phone}</p>
              )}
            </>
          ) : (
            <p className="text-gray-600">{shopData.phone}</p>
          )}
        </div>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4 text-primary-500">
            <FaMapMarkerAlt className="text-xl" />
            <h3 className="text-lg font-semibold">Shop Address</h3>
          </div>
          {isEditing ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div>
                  <input
                    type="text"
                    name="address.street"
                    value={shopData.address.street}
                    onChange={handleInputChange}
                    placeholder="Street Address"
                    className="w-full p-3 border-2 border-primary-100 rounded-lg focus:border-primary-500 focus:outline-none"
                  />
                  {errors['address.street'] && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors['address.street']}
                    </p>
                  )}
                </div>
                <div>
                  <input
                    list="city"
                    id="city"
                    name="address.city"
                    value={shopData.address.city}
                    onChange={handleInputChange}
                    placeholder="City"
                    className="w-full p-3 border-2 border-primary-100 rounded-lg focus:border-primary-500 focus:outline-none"
                  />
                  <datalist id="city">
                    {uniqueCities.map((city) => (
                      <option key={city} value={city} />
                    ))}
                  </datalist>

                  {errors['address.city'] && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors['address.city']}
                    </p>
                  )}
                </div>
                <div>
                  <input
                    type="text"
                    name="address.state"
                    value={shopData.address?.state}
                    onChange={handleInputChange}
                    placeholder="Region/State"
                    className="w-full p-3 border-2 border-primary-100 rounded-lg focus:border-primary-500 focus:outline-none"
                  />
                  {errors['address.state'] && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors['address.state']}
                    </p>
                  )}
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <input
                    type="text"
                    name="address.postalCode"
                    value={shopData.address.postalCode}
                    onChange={handleInputChange}
                    placeholder="Postal Code"
                    className="w-full p-3 border-2 border-primary-100 rounded-lg focus:border-primary-500 focus:outline-none"
                  />
                  {errors['address.postalCode'] && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors['address.postalCode']}
                    </p>
                  )}
                </div>
                <div>
                  <input
                    list="country"
                    id="country"
                    name="address.country"
                    value={shopData.address.country}
                    placeholder="Country"
                    onChange={handleInputChange}
                    className="w-full p-3 border-2 border-primary-100 rounded-lg focus:border-primary-500 focus:outline-none"
                  />
                  <datalist id="country">
                    {uniqueCountries.map((country) => (
                      <option key={country} value={country} />
                    ))}
                  </datalist>
                  {errors['address.country'] && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors['address.country']}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-2 text-gray-600">
              <p>{shopData.address?.street}</p>
              <p>
                {shopData.address?.city}, {shopData.address?.state}
              </p>
              <p>{shopData.address?.postalCode}</p>
              <p>{shopData.address?.country}</p>
            </div>
          )}
        </div>
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4 text-primary-500">
            <FaImage className="text-xl" />
            <h3 className="text-lg font-semibold">Shop Images</h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {shopData.images?.map((img: any, index: any) => (
              <div
                key={`existing-${index}`}
                className="relative aspect-square bg-primary-100 rounded-lg overflow-hidden"
              >
                <img
                  src={img}
                  alt={`Shop ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                {isEditing && (
                  <button
                    type="button"
                    onClick={() => handleRemoveExistingImage(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                    title="Remove image"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
            {imagePreviews.map((preview, index) => (
              <div
                key={`preview-${index}`}
                className="relative aspect-square bg-primary-100 rounded-lg overflow-hidden"
              >
                <img
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                {isEditing && (
                  <button
                    type="button"
                    onClick={() => handleRemovePreview(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                    title="Remove preview"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
            {isEditing && (
              <div className="relative">
                <input
                  type="file"
                  id="imagesUpload"
                  accept="image/*"
                  multiple
                  onChange={handleImagesChange}
                  className="hidden"
                />
                <label
                  htmlFor="imagesUpload"
                  className="aspect-square bg-primary-100 hover:bg-primary-200 rounded-lg flex flex-col items-center justify-center cursor-pointer transition-colors group"
                >
                  <FaImage className="text-2xl text-primary-500 mb-2 group-hover:text-primary-600 transition-colors" />
                  <span className="text-sm text-center text-primary-500 group-hover:text-primary-600">
                    Add Images
                  </span>
                  <span className="text-xs text-gray-400 mt-1">(Multiple)</span>
                </label>
              </div>
            )}
          </div>
          {errors.images && (
            <p className="text-red-500 mt-2">{errors.images}</p>
          )}
        </div>

        {/* Timestamps */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <FaClock />
            <span>
              Created: {new Date(shopData.createdAt).toLocaleDateString()}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <FaClock />
            <span>
              Last Updated: {new Date(shopData.updatedAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyShop;
