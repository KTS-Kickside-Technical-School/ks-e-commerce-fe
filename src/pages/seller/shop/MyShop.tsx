import { useEffect, useState } from 'react';
import {
  FaStore,
  FaPhone,
  FaImage,
  FaClock,
  FaMapMarkerAlt,
} from 'react-icons/fa';
import { MdDescription } from 'react-icons/md';
import {
  sellerGetShopDetails,
  sellerUpdateShop,
} from '../../../requests/shopRequest';
import Logo from '/logo.png';
import uploadToCloudinary from '../../../helpers/cloudinary';
import { toast } from 'sonner';

const isImage = (file: File) => file.type.startsWith('image/');

const MyShop = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [shopData, setShopData] = useState<any>({
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

    const requiredAddressFields = [
      'street',
      'city',
      'postalCode',
      'country',
      'state',
    ];
    requiredAddressFields.forEach((field: any) => {
      if (!shopData.address?.[field]?.trim()) {
        newErrors[`address.${field}`] = `${
          field[0].toUpperCase() + field.slice(1)
        } is required`;
      }
    });

    // Image validations
    const totalImages = shopData.images.length + newImages.length;
    if (totalImages < 3) newErrors.images = 'At least 3 images are required';
    if (totalImages > 10) newErrors.images = 'Maximum 10 images are allowed';

    // Show errors if any
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error('Please fix validation errors.');
      return;
    }

    try {
      setIsSaving(true);

      // Upload logo if updated
      let logoUrl = shopData.logo;
      if (newLogo) {
        logoUrl = await uploadToCloudinary(newLogo);
      }

      // Upload new images
      const uploadedImages = await Promise.all(
        newImages.map(uploadToCloudinary)
      );

      // Strip unneeded fields
      const { _id, createdAt, updatedAt, __v, seller, ...rest } = shopData;

      // Final object to submit
      const updatedData = {
        ...rest,
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

  if (isLoading) {
    return (
      <div className="w-full h-96 flex justify-center items-center">
        <p className="text-lg text-primary-500 font-semibold">Loading...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-primary-100">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-primary-500 flex items-center gap-3">
            <FaStore className="text-2xl" />
            {isEditing ? (
              <input
                type="text"
                name="name"
                value={shopData.name}
                onChange={handleInputChange}
                className={`border-b-2 border-primary-500 focus:outline-none ${
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
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              isEditing
                ? 'bg-green-500 hover:bg-green-600 text-white'
                : 'bg-primary-100 hover:bg-primary-200 text-primary-700'
            } ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isSaving ? 'Saving...' : isEditing ? 'Save Changes' : 'Edit Shop'}
          </button>
        </div>
        {errors.name && <p className="text-red-500 mb-2">{errors.name}</p>}

        <div className="mb-8 flex items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-primary-100 flex items-center justify-center">
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
                className="flex items-center gap-2 cursor-pointer text-primary-500 hover:text-primary-600 transition-colors group"
              >
                <div className="p-2 bg-primary-100 rounded-lg group-hover:bg-primary-200 transition-colors">
                  <FaImage className="text-lg" />
                </div>
                <span className="font-medium">Upload Logo</span>
                <span className="text-sm text-gray-400">
                  (JPEG, PNG, max 5MB)
                </span>
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
                className={`w-full p-3 border-2 border-primary-100 rounded-lg focus:border-primary-500 focus:outline-none ${
                  errors.description ? 'border-red-500' : ''
                }`}
                rows={4}
              />
              {errors.description && (
                <p className="text-red-500 mt-2">{errors.description}</p>
              )}
            </>
          ) : (
            <p className="text-gray-600">{shopData.description}</p>
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
            <div className="grid grid-cols-2 gap-4">
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
                    type="text"
                    name="address.city"
                    value={shopData.address.city}
                    onChange={handleInputChange}
                    placeholder="City"
                    className="w-full p-3 border-2 border-primary-100 rounded-lg focus:border-primary-500 focus:outline-none"
                  />
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
                    type="text"
                    name="address.country"
                    value={shopData.address.country}
                    onChange={handleInputChange}
                    placeholder="Country"
                    className="w-full p-3 border-2 border-primary-100 rounded-lg focus:border-primary-500 focus:outline-none"
                  />
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
          <div className="grid grid-cols-3 gap-4">
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
                  <span className="text-sm text-primary-500 group-hover:text-primary-600">
                    Add Images
                  </span>
                  <span className="text-xs text-gray-400 mt-1">
                    (Multiple allowed)
                  </span>
                </label>
              </div>
            )}
          </div>
          {errors.images && (
            <p className="text-red-500 mt-2">{errors.images}</p>
          )}
        </div>

        {/* Timestamps */}
        <div className="flex gap-6 text-sm text-gray-400">
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
