import React from 'react';
import { FaSave, FaTimes, FaUpload } from 'react-icons/fa';
import RichTextEditor from '../../RichTextEditor';
import { editProduct } from '../../../requests/productsRequests';
import { toast } from 'sonner';
import uploadToCloudinary from '../../../helpers/cloudinary';
import { adminViewCategories } from '../../../requests/categoriesRequest';

interface Props {
  product: any;
  onClose: () => void;
}
class SellerEditProductModal extends React.Component<Props, any> {
  constructor(props: Props) {
    super(props);
    this.state = {
      formData: {
        productId: props.product._id,
        productName: props.product.productName,
        description: props.product.description,
        price: props.product.price,
        category: props.product.category,
        discount: props.product.discount,
        stock: props.product.stock,
        status: props.product.status || 'inactive',
        categories: [],
        shippingOptions: {
          fee: props.product?.shippingOptions?.fee || 0,
          note: props.product?.shippingOptions?.note || 'no note',
          duration: props.product?.shippingOptions?.duration,
        },
      },
      images: props.product.images,
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
    if (formData.discount < 0 || formData.discount > 100) {
      errors.discount = 'Discount must be between 0% and 100%';
    }
    if (!formData.category.trim()) {
      errors.category = 'Category is required';
    }

    this.setState({ errors });
    return Object.keys(errors).length === 0;
  };

  handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!this.validateForm()) return;

    this.setState({ loading: true });
    try {
      const id = this.state.formData.productId;

      delete this.state.formData.categories;
      delete this.state.formData.productId;
      const response = await editProduct(id, {
        ...this.state.formData,
        images: this.state.images,
        category: this.state.formData.category,
      });

      if (response.status !== 200) {
        toast.error(response.message);
        return;
      }
      toast.success('Product updated successfully');
      this.props.onClose();
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
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[200]">
        <div className="bg-white h-[95%] overflow-auto p-8 rounded-lg shadow-2xl w-full max-w-4xl">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            Edit Product
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

                <div>
                  <label
                    htmlFor="productName"
                    className="block text-sm font-medium text-gray-700 mb-1 mt-2"
                  >
                    Product Stock
                  </label>
                  <input
                    type="number"
                    id="productStock"
                    name="stock"
                    value={formData.stock}
                    onChange={this.handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="Enter product stock"
                  />
                  {errors.stock && (
                    <p className="text-red-500 text-sm mt-1">{errors.stock}</p>
                  )}
                </div>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-sm font-medium text-gray-700">
                    Product Status
                  </span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={formData.status === 'active'}
                      onChange={(e) =>
                        this.setState((prevState: any) => ({
                          formData: {
                            ...prevState.formData,
                            status: e.target.checked ? 'active' : 'inactive',
                          },
                        }))
                      }
                    />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-green-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full" />
                    <span className="ml-3 text-sm text-gray-600">
                      {formData.status === 'active' ? 'Active' : 'Inactive'}
                    </span>
                  </label>
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
                    htmlFor="discount"
                    className="block text-sm font-medium text-gray-700 mb-1 mt-2"
                  >
                    Discount (%)
                  </label>
                  <input
                    type="number"
                    id="discount"
                    name="discount"
                    value={formData.discount}
                    onChange={this.handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="Enter discount percentage"
                    min={0}
                    max={100}
                  />
                  {errors.discount && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.discount}
                    </p>
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
    );
  }
}

export default SellerEditProductModal;
