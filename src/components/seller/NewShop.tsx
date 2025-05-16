import { useState } from 'react';
import { toast, Toaster } from 'sonner';
import uploadToCloudinary from '../../helpers/cloudinary';
import SEO from '../../middlewares/SEO';
import { sellerCreateShop } from '../../requests/shopRequest';
import { useNavigate } from 'react-router-dom';

const NewShopForm = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [logo, setLogo] = useState<File | null>(null);
  const [images, setImages] = useState<File[]>([]);
  const [error, setError] = useState('');
  const [isSubmiting, setIsSubmiting] = useState(false);

  const navigate = useNavigate();

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setLogo(e.target.files[0]);
    }
  };

  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files);
      setImages((prev) => [...prev, ...newImages]);
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    setIsSubmiting(true);
    e.preventDefault();
    if (!name || !logo) {
      setError('Name and logo are required.');
      return;
    }
    setError('');
    try {
      const logoUrl = await uploadToCloudinary(logo);
      const imageUrls = await Promise.all(
        images.map((img) => uploadToCloudinary(img))
      );

      const shopData = { name, description, logo: logoUrl, images: imageUrls };
      const response = await sellerCreateShop(shopData);
      if (response.status !== 201) {
        toast.error(response.message);
        return;
      }
      toast.success(response.message);
      setTimeout(() => navigate('/seller/'), 2000);
      return;
    } catch (error: any) {
      toast.error('Error creating shop', error.message);
    } finally {
      setIsSubmiting(false);
    }
  };

  return (
    <>
      <Toaster richColors position="top-center" />
      <SEO
        title="New Shop - Kickside E-Commerce Rw"
        description="Seller create new shop"
      />
      <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-purple-50 to-pink-50 p-6 font-sans">
        <div className="max-w-4xl mx-auto transform transition-all duration-300 hover:shadow-xl">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 py-6 px-8">
              <h1 className="text-3xl font-extrabold text-white tracking-tight">
                Create Your Shop
              </h1>
              <p className="text-indigo-100 mt-2">
                Fill out the details below to get started
              </p>
            </div>

            <div className="p-8">
              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-md">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-5 w-5 text-red-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Shop Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring focus:ring-indigo-200 focus:border-indigo-500 transition-all"
                    placeholder="e.g. Awesome Creations"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring focus:ring-indigo-200 focus:border-indigo-500 transition-all"
                    rows={4}
                    placeholder="Tell customers about your shop..."
                  />
                </div>

                <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Shop Logo <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center space-x-6">
                    <div className="flex-shrink-0">
                      {logo ? (
                        <img
                          src={URL.createObjectURL(logo)}
                          alt="Logo Preview"
                          className="w-24 h-24 object-cover rounded-lg shadow-md ring-2 ring-indigo-200"
                        />
                      ) : (
                        <div className="w-24 h-24 rounded-lg bg-gray-200 flex items-center justify-center text-gray-400">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-12 w-12"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="relative">
                        <input
                          type="file"
                          id="logo-upload"
                          className="hidden"
                          onChange={handleLogoChange}
                          accept="image/*"
                          required
                        />
                        <label
                          htmlFor="logo-upload"
                          className="cursor-pointer py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          Choose logo
                        </label>
                        {logo && (
                          <p className="mt-2 text-xs text-gray-500">
                            {logo.name}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Shop Images
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      id="images-upload"
                      className="hidden"
                      onChange={handleImagesChange}
                      accept="image/*"
                      multiple
                    />
                    <label
                      htmlFor="images-upload"
                      className="cursor-pointer py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Add shop images
                    </label>
                  </div>

                  {images.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">
                        {images.length}{' '}
                        {images.length === 1 ? 'image' : 'images'} selected
                      </p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {images.map((image, index) => (
                          <div
                            key={index}
                            className="group relative rounded-lg overflow-hidden bg-gray-100 aspect-square"
                          >
                            <img
                              src={URL.createObjectURL(image)}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(index)}
                              className="absolute top-2 right-2 rounded-full bg-black bg-opacity-50 p-1 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                              aria-label="Remove image"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full py-3 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg shadow-md hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all transform hover:-translate-y-1"
                  >
                    {isSubmiting ? (
                      <div className="spinner-border animate-spin inline-block w-6 h-6 border-4 border-solid border-indigo-300 border-t-transparent rounded-full"></div>
                    ) : (
                      'Create Shop'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NewShopForm;
