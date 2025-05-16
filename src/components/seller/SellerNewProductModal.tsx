import React from 'react';
import { FaTimes, FaUpload } from 'react-icons/fa';
import RichTextEditor from '../RichTextEditor';
import { createProduct } from '../../requests/productsRequests';
import { toast } from 'sonner';
import uploadToCloudinary from '../../helpers/cloudinary';

interface Props {
  onClose: () => void;
}
class SellerNewProductModal extends React.Component<Props, any> {
  constructor(props: Props) {
    super(props);
    this.state = {
      formData: {
        productName: '',
        description: '',
        price: '',
        category: '',
      },
      images: [],
      loading: false,
      errors: {},
    };
  }

  handleInputChange = (e: any) => {
    const { name, value } = e.target;
    this.setState((prevState: any) => ({
      formData: {
        ...prevState.formData,
        [name]: value,
      },
      errors: {
        ...prevState.errors,
        [name]: '',
      },
    }));
  };

  handleDescriptionChange = (value: any) => {
    this.setState((prevState: any) => ({
      formData: {
        ...prevState.formData,
        description: value,
      },
    }));
  };

  handleImageUpload = async (files: any) => {
    try {
      const uploadPromises = Array.from(files).map((file) =>
        uploadToCloudinary(file)
      );
      const uploadedResults = await Promise.all(uploadPromises);
      this.setState((prevState: any) => ({
        images: [...prevState.images, ...uploadedResults],
      }));
    } catch (error) {
      toast.error('Error uploading images');
    }
  };

  handleImageDelete = (index: any) => {
    this.setState((prevState: any) => ({
      images: prevState.images.filter((_: any, i: any) => i !== index),
    }));
  };

  validateForm = () => {
    const errors: any = {};
    const { formData }: any = this.state;

    if (!formData.productName.trim()) {
      errors.productName = 'Product name is required';
    }
    if (!formData.description.trim() || formData.description === '<p></p>') {
      errors.description = 'Description is required';
    }
    if (!formData.price) {
      errors.price = 'Price is required';
    }
    if (this.state.images.length === 0 || !this.state.images) {
      errors.images = 'Please upload at least one image';
    }

    this.setState({ errors });
    return Object.keys(errors).length === 0;
  };

  handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!this.validateForm()) return;

    this.setState({ loading: true });
    try {
      const response = await createProduct({
        ...this.state.formData,
        images: this.state.images,
        category: this.state.formData.category,
      });
      if (response.status !== 201) {
        toast.error(response.message);
        return;
      }
      toast.success('Product created successfully');
      await this.props.onClose();
    } catch (error: any) {
      toast.error('Unknown error occured', error.message);
    } finally {
      this.setState({ loading: false });
    }
  };

  render() {
    const { formData, images, loading, errors }: any = this.state;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-4xl">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">New Product</h2>
          <form
            onSubmit={this.handleSubmit}
            className="flex flex-col md:flex-row gap-8"
          >
            <div className="flex-1 space-y-6">
              <div>
                <label
                  htmlFor="productName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Product Name
                </label>
                <input
                  type="text"
                  id="productName"
                  name="productName"
                  value={formData.productName}
                  onChange={this.handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="Enter product name"
                />
                {errors.productName && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.productName}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="productDescription"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Product Description
                </label>
                <RichTextEditor
                  height={200}
                  id="productDescription"
                  value={formData.description}
                  onChange={this.handleDescriptionChange}
                />
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.description}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="productName"
                  className="block text-sm font-medium text-gray-700 mb-1 mt-2"
                >
                  Product Price
                </label>
                <input
                  type="number"
                  id="productPrice"
                  name="price"
                  value={formData.price}
                  onChange={this.handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="Enter product price"
                />
                {errors.price && (
                  <p className="text-red-500 text-sm mt-1">{errors.price}</p>
                )}
              </div>
            </div>

            <div className="flex-1 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Images
                </label>
                <div
                  className="mt-1 p-6 border-2 border-dashed border-gray-300 rounded-lg bg-gray-100"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    this.handleImageUpload(e.dataTransfer.files);
                  }}
                >
                  <div className="text-center">
                    <FaUpload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                    <input
                      id="file-upload"
                      type="file"
                      className="hidden"
                      multiple
                      onChange={(e: any) => {
                        this.handleImageUpload(e.target.files);
                        e.target.value = null;
                      }}
                    />
                    <label
                      htmlFor="file-upload"
                      className="cursor-pointer text-primary-600 hover:text-primary-500"
                    >
                      Upload images
                    </label>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {images.map((image: any, index: number) => (
                    <div key={index} className="relative">
                      <img
                        src={image}
                        className="w-20 h-20 object-cover rounded-lg"
                        alt="Upload preview"
                      />
                      <button
                        type="button"
                        onClick={() => this.handleImageDelete(index)}
                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                      >
                        <FaTimes className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
                {errors.images && (
                  <p className="text-red-500 text-sm mt-1">{errors.images}</p>
                )}
              </div>
              <div>
                <label
                  htmlFor="productName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Product Category
                </label>
                <input
                  type="text"
                  id="productCategory"
                  name="category"
                  value={formData.category}
                  onChange={this.handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="Enter product name"
                />
                {errors.category && (
                  <p className="text-red-500 text-sm mt-1">{errors.category}</p>
                )}
              </div>
            </div>
          </form>
          <div className="flex justify-end gap-4 mt-8">
            <button
              type="button"
              onClick={this.props.onClose}
              className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-2 rounded-lg"
              onClick={this.handleSubmit}
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default SellerNewProductModal;
