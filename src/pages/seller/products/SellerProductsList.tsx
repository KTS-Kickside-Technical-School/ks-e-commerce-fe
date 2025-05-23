import { useEffect, useState, useCallback } from 'react';
import SkeletonTable from '../../../components/SkeletonTable';
import { FaPlus, FaChevronLeft, FaChevronRight, FaEdit } from 'react-icons/fa';
import { iProduct } from '../../../types/store';
import SellerNewProductModal from '../../../components/seller/products/SellerNewProductModal';
import { sellerViewProducts } from '../../../requests/productsRequests';
import { toast } from 'sonner';
import SellerEditProductModal from '../../../components/seller/products/SellerEditProductModal';

const SellerProductsList = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<iProduct[]>([]);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [error, setError] = useState('');
  const [imageIndex, setImageIndex] = useState<{ [key: string]: number }>({});
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<iProduct | null>(null);
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await sellerViewProducts();
      console.log(response);
      if (response.status !== 200) {
        toast.error(response.message);
        setError(response.message);
        return;
      }
      setData(response.data.products);
    } catch (error: any) {
      toast.error('An error occurred while fetching products');
      setError('Failed to load products. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleImageChange = (
    id: string,
    direction: 'prev' | 'next',
    images: string[]
  ) => {
    setImageIndex((prev) => {
      const currentIndex = prev[id] || 0;
      const newIndex =
        direction === 'next'
          ? (currentIndex + 1) % images.length
          : (currentIndex - 1 + images.length) % images.length;
      return { ...prev, [id]: newIndex };
    });
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold text-gray-700">Products List</h2>
        <button
          title="Add New Product"
          onClick={() => setIsProductModalOpen(true)}
          className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all shadow-md hover:shadow-lg"
        >
          <FaPlus className="text-sm" />
          <span className="hidden sm:inline">Add Product</span>
        </button>
      </div>
      <div className="overflow-x-auto bg-white shadow-lg rounded-lg p-4">
        {loading ? (
          <SkeletonTable rows={5} cols={6} />
        ) : error ? (
          <div className="text-center text-red-500 py-4">{error}</div>
        ) : data.length > 0 ? (
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-gray-200 text-gray-700">
                <th className="p-3 text-left">#</th>
                <th className="p-3 text-left">Images</th>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Price</th>
                <th className="p-3 text-left">Stock</th>
                <th className="p-3 text-left">Discount</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((product, index) => (
                <tr
                  key={product._id}
                  className="border-b hover:bg-gray-100 transition duration-200"
                >
                  <td className="p-3">{index + 1}</td>
                  <td className="p-3 flex items-center justify-center gap-2">
                    {product.images.length > 1 && (
                      <button
                        onClick={() =>
                          handleImageChange(product._id, 'prev', product.images)
                        }
                      >
                        <FaChevronLeft className="text-gray-600 hover:text-gray-800" />
                      </button>
                    )}

                    <img
                      src={product.images[imageIndex[product._id] || 0]}
                      alt={product.productName}
                      className="w-12 h-12 rounded-md border object-cover"
                    />

                    {product.images.length > 1 && (
                      <button
                        onClick={() =>
                          handleImageChange(product._id, 'next', product.images)
                        }
                      >
                        <FaChevronRight className="text-gray-600 hover:text-gray-800" />
                      </button>
                    )}
                  </td>
                  <td className="p-3 font-medium">{product.productName}</td>
                  <td className="p-3 text-gray-600">{product.price} RWF</td>
                  <td className="p-3 text-gray-600">{product.stock}</td>
                  <td className="p-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        product.discount === 0 ||
                        product.discount === null ||
                        product.discount === undefined
                          ? 'bg-gray-100 text-gray-500'
                          : product.discount > 0 && product.discount <= 10
                          ? 'bg-yellow-100 text-yellow-700'
                          : product.discount > 10 && product.discount <= 30
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-green-100 text-green-700'
                      }`}
                    >
                      {Number(product.discount || 0)}%
                    </span>
                  </td>

                  <td className="p-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        product.status === 'active'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {product.status === 'active' ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="p-3 flex justify-center space-x-3">
                    <button
                      onClick={() => {
                        setProductToEdit({ ...product });
                        setIsEditModalOpen(true);
                        setIsEditModalOpen(true);
                      }}
                      className="p-2 rounded-md bg-green-500 hover:bg-green-600 text-white flex items-center transition duration-200"
                    >
                      <FaEdit />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center text-gray-500 py-4">
            No products found.
          </div>
        )}
      </div>
      {isProductModalOpen && (
        <SellerNewProductModal onClose={() => setIsProductModalOpen(false)} />
      )}
      {isEditModalOpen && (
        <SellerEditProductModal
          onClose={async () => {
            await fetchProducts();
            setIsEditModalOpen(false);
          }}
          product={productToEdit}
        />
      )}
    </div>
  );
};

export default SellerProductsList;
