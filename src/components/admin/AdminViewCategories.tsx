import { useEffect, useState } from 'react';
import SEO from '../../middlewares/SEO';
import ProductsSubNavBar from './ProductsSubNavBar';
import {
  adminDeleteCategory,
  adminEditCategory,
  adminSaveCategory,
  adminViewCategories,
} from '../../requests/categoriesRequest';
import { toast } from 'sonner';
import { FaEdit, FaPlus, FaTrash } from 'react-icons/fa';
import { IProductCategory } from '../../types/store';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const AdminViewCategories = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [categoryName, setCategoryName] = useState('');
  const [idToEdit, setIdToEdit] = useState('');
  const [idToDelete, setIdToDelete] = useState('');

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await adminViewCategories();
      if (response.status !== 200) {
        toast.error(response.message);
        return;
      }
      setData(response.data.categories);
    } catch (error: any) {
      toast.error('Unknown error occurred', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleEditCategorySubmit = async (e: any) => {
    e.preventDefault();
    if (!categoryName.trim()) {
      toast.error('Category name cannot be empty');
      return;
    }
    try {
      const response = await adminEditCategory({
        _id: idToEdit,
        name: categoryName,
      });
      if (response.status !== 200) {
        toast.error(response.message);
        return;
      }
      toast.success('Category edited successfully!');
      setCategoryName('');
      setIdToEdit('');
      await fetchCategories();
      setIsEditModalOpen(false);
    } catch (error) {
      toast.error('Failed to edit category. Please try again.');
    }
  };

  const handleDeleteCategory = async () => {
    try {
      const response = await adminDeleteCategory(idToDelete);
      
      if (response.status !== 200) {
        toast.error(response?.message);
        return;
      }
      toast.success('Category deleted successfully');
      await fetchCategories();
      setIsDeleteModalOpen(false);
    } catch (error: any) {
      toast.error('Unknown error occurred deleting category', error.message);
    }
  };
  const [isNewCategoryModalOpen, setIsNewCategoryModalOpen] = useState(false);

  const handleNewCategoryClick = () => {
    setIsNewCategoryModalOpen(true);
  };

  const handleCategoryNameChange = (e: any) => {
    setCategoryName(e.target.value);
  };

  const handleCategorySubmit = async (e: any) => {
    e.preventDefault();

    if (!categoryName.trim()) {
      toast.error('Category name cannot be empty');
      return;
    }
    try {
      const response = await adminSaveCategory({ name: categoryName });
      if (response.status !== 201) {
        toast.error(response.message);
        return;
      }
      toast.success(`Category "${categoryName}" created successfully!`);
      await fetchCategories();
      setCategoryName('');
      setIsNewCategoryModalOpen(false);
    } catch (error) {
      toast.error('Failed to create category. Please try again.');
    }
  };

  return (
    <>
      <SEO title="View Categories: Admin Kickside E-Commerce" />
      <div>
        <ProductsSubNavBar />
        <div className="p-6">
          <div className="flex justify-between items-center mb-6 border-b pb-4">
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-4">
              Categories List
              <button
                onClick={handleNewCategoryClick}
                title="New Category"
                className="bg-primary-500 hover:bg-primary-600 text-white px-5 py-2 rounded-lg flex items-center gap-2 transition-all shadow-md hover:shadow-lg"
              >
                <FaPlus className="text-sm" />
              </button>
            </h1>
          </div>
          {loading ? (
            <div className="space-y-3 bg-white px-3">
              {[...Array(5)].map((_, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center border-b py-4"
                >
                  <Skeleton width={30} height={20} />
                  <Skeleton width={200} height={20} />
                  <div className="flex gap-4">
                    <Skeleton width={24} height={24} />
                    <Skeleton width={24} height={24} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data.map((category: IProductCategory, index) => (
                  <tr key={category._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {category.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <button
                        onClick={() => {
                          setIsEditModalOpen(true);
                          setCategoryName(category.name);
                          setIdToEdit(category._id);
                        }}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => {
                          setIdToDelete(category._id);
                          setIsDeleteModalOpen(true);
                        }}
                        className="ml-2 text-red-600 hover:text-red-900"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
      {isNewCategoryModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">New Category</h2>
            <form onSubmit={handleCategorySubmit}>
              <div className="mb-4">
                <label
                  htmlFor="categoryName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Category Name
                </label>
                <input
                  type="text"
                  id="categoryName"
                  value={categoryName}
                  onChange={handleCategoryNameChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter category name"
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewCategoryModalOpen(false)}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Edit Category</h2>
            <form onSubmit={handleEditCategorySubmit}>
              <input
                type="text"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                placeholder="Enter category name"
                required
              />
              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Are you sure?</h2>
            <p>
              Do you really want to delete this category? This action cannot be
              undone.
            </p>
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteCategory}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminViewCategories;
