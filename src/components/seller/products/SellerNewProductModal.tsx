import React from 'react';
import { FaSave, FaTimes, FaUpload } from 'react-icons/fa';
import RichTextEditor from '../../RichTextEditor';
import { createProduct } from '../../../requests/productsRequests';
import { toast } from 'sonner';
import uploadToCloudinary from '../../../helpers/cloudinary';
import { adminViewCategories } from '../../../requests/categoriesRequest';
import SEO from '../../../middlewares/SEO';

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
        categories: [],
        shippingOptions: {
          fee: 0,
          note: 'Free shipping',
          duration: '2 days',
        },
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
  handleShippingInputChange = (e: any) => {
    const { name, value } = e.target;
    this.setState((prevState: any) => ({
      formData: {
        ...prevState.formData,
        shippingOptions: {
          ...prevState.formData.shippingOptions,
          [name]: value,
        },
      },
      errors: {
        ...prevState.errors,
        shippingOptions: '',
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
    if (!formData.category.trim()) {
      errors.category = 'Category is required';
    }
    if (
      formData.shippingOptions.fee === '' ||
      !formData.shippingOptions.note.trim() ||
      !formData.shippingOptions.duration.trim()
    ) {
      errors.shippingOptions = 'Fee, note and duration are all required';
    }

    this.setState({ errors });
    return Object.keys(errors).length === 0;
  };

  handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!this.validateForm()) return;

    this.setState({ loading: true });
    try {
      delete this.state.formData.categories;
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

  getCategories = async () => {
    try {
      const response = await adminViewCategories();
      if (response.status === 200) {
        this.setState({ categories: response.data.categories }); // ✅ Use setState
      }
    } catch (error) {
      toast.error('Failed to fetch categories');
    }
  };

  componentDidMount() {
    this.getCategories();
  }
  render() {
    const { formData, images, loading, errors }: any = this.state;

    return (
      <>
        <SEO title="New Product - Kickside Store" />
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[200]">
          <div className="bg-white h-[95%] overflow-auto p-8 rounded-lg shadow-2xl w-full max-w-4xl">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              New Product
            </h2>
            <div className="max-h-[70vh] overflow-y-auto">
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
                      <span className="text-red-500">*</span>
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
                      <span className="text-red-500">*</span>
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
                      Product Price(FRW)
                      <span className="text-red-500">*</span>
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
                      <p className="text-red-500 text-sm mt-1">
                        {errors.price}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex-1 space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Product Images
                      <span className="text-red-500">*</span>
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
                      <p className="text-red-500 text-sm mt-1">
                        {errors.images}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="productName"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Product Category
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      list="categories"
                      id="productCategory"
                      name="category"
                      value={formData.category}
                      onChange={this.handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      placeholder="Enter product name"
                    />
                    <datalist id="categories">
                      {this.state.categories?.map((category: any) => (
                        <option key={category._id} value={category.name}>
                          {category.name}
                        </option>
                      ))}
                    </datalist>
                    {errors.category && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.category}
                      </p>
                    )}
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Shipping Options
                      <span className="text-red-500">*</span>
                    </label>
                    <p className="text-yellow-700 bg-yellow-100 rounded-md text-sm mt-2 px-3 py-2 border border-yellow-300">
                      If you don't change the shipping options values, the
                      default ones will be saved.
                    </p>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                      <div>
                        <label
                          htmlFor="shippingFee"
                          className="block text-sm text-gray-600 mb-1"
                        >
                          Fee(FRW)
                          <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          id="shippingFee"
                          name="fee"
                          onChange={this.handleShippingInputChange}
                          className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="e.g. 2000"
                          min="0"
                          value={formData.shippingOptions.fee}
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="shippingNote"
                          className="block text-sm text-gray-600 mb-1"
                        >
                          Note
                          <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          id="shippingNote"
                          name="note"
                          value={formData.shippingOptions.note}
                          onChange={this.handleShippingInputChange}
                          className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="e.g. Free shipping"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="shippingDuration"
                          className="block text-sm text-gray-600 mb-1"
                        >
                          Duration
                          <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          id="shippingDuration"
                          name="duration"
                          value={formData.shippingOptions.duration}
                          onChange={this.handleShippingInputChange}
                          className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                    {errors.shippingOptions && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.shippingOptions}
                      </p>
                    )}
                  </div>
                </div>
              </form>
            </div>
            <div className="flex justify-end gap-4 mt-8">
              <button
                type="button"
                onClick={this.props.onClose}
                className="bg-red-500 flex hover:bg-gray-600 text-white px-6 py-2 rounded-lg"
              >
                <FaTimes className="m-1" />
                <span>Cancel</span>
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-2 rounded-lg"
                onClick={this.handleSubmit}
              >
                {loading ? (
                  'Saving...'
                ) : (
                  <div className="flex">
                    <FaSave className="m-1" />
                    <span>Save</span>
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default SellerNewProductModal;
