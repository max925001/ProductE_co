import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchProducts, updateProduct, deleteProduct } from '../redux/slices/productSlice';
import SideBarHeader from '../components/SideBarHeader';
import { FaEdit, FaTrash } from 'react-icons/fa';

const EditDeleteProductsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { products, loading, error } = useSelector((state) => state.product);

  // Fetch all products if not already loaded
  useEffect(() => {
    if (products.length === 0) {
      dispatch(fetchProducts({ limit: 100, skip: 0 }));
    }
  }, [dispatch, products.length]);

  // Handle Edit button click
  const handleEdit = (product) => {
    const updatedData = {
      title: `${product.title} (Updated)`, // Example update
    };
    dispatch(updateProduct({ id: product.id, updatedData }));
  };

  // Handle Delete button click
  const handleDelete = (id) => {
    dispatch(deleteProduct(id));
  };

  if (loading) {
    return (
      <SideBarHeader>
        <div className="w-full max-w-7xl mx-auto px-2 xs:px-3 sm:px-4 md:px-6 lg:px-8 py-6">
          <p className="text-gray-300 text-center">Loading products...</p>
        </div>
      </SideBarHeader>
    );
  }

  if (error) {
    return (
      <SideBarHeader>
        <div className="w-full max-w-7xl mx-auto px-2 xs:px-3 sm:px-4 md:px-6 lg:px-8 py-6">
          <p className="text-red-500 text-center">Error: {error}</p>
        </div>
      </SideBarHeader>
    );
  }

  return (
    <SideBarHeader>
      <div className="w-screen md:w-full  max-w-7xl  mx-auto px-2 xs:px-3 sm:px-4 md:px-6 lg:px-8 py-6 bg-gray-900 min-h-screen overflow-hidden">
        {/* Header Section */}
        <section className="mb-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-orange-500 hover:underline text-sm xs:text-base mb-4 inline-block"
          >
            ← Back to Dashboard
          </button>
          <h1 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold text-orange-500">
            Edit/Delete Products
          </h1>
        </section>

        {/* Product List Section */}
        <section className="bg-gray-800 rounded-lg shadow-lg p-4 xs:p-5 sm:p-6">
          <h2 className="text-lg xs:text-xl sm:text-2xl md:text-3xl font-semibold text-orange-500 mb-4">
            Product List
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-gray-300">
              <thead>
                <tr className="bg-gray-700">
                  <th className="p-2 xs:p-2 sm:p-3 md:p-4 text-xs xs:text-sm sm:text-base min-w-[60px]">ID</th>
                  <th className="p-2 xs:p-2 sm:p-3 md:p-4 text-xs xs:text-sm sm:text-base min-w-[150px]">Title</th>
                  <th className="p-2 xs:p-2 sm:p-3 md:p-4 text-xs xs:text-sm sm:text-base min-w-[100px] hidden sm:table-cell">Category</th>
                  <th className="p-2 xs:p-2 sm:p-3 md:p-4 text-xs xs:text-sm sm:text-base min-w-[80px]">Price</th>
                  <th className="p-2 xs:p-2 sm:p-3 md:p-4 text-xs xs:text-sm sm:text-base min-w-[80px] hidden md:table-cell">Stock</th>
                  <th className="p-2 xs:p-2 sm:p-3 md:p-4 text-xs xs:text-sm sm:text-base min-w-[120px]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-b border-gray-700 hover:bg-gray-600">
                    <td className="p-2 xs:p-2 sm:p-3 md:p-4 text-xs xs:text-sm sm:text-base">{product.id}</td>
                    <td className="p-2 xs:p-2 sm:p-3 md:p-4 text-xs xs:text-sm sm:text-base">{product.title}</td>
                    <td className="p-2 xs:p-2 sm:p-3 md:p-4 text-xs xs:text-sm sm:text-base hidden sm:table-cell">{product.category}</td>
                    <td className="p-2 xs:p-2 sm:p-3 md:p-4 text-xs xs:text-sm sm:text-base">${product.price}</td>
                    <td className="p-2 xs:p-2 sm:p-3 md:p-4 text-xs xs:text-sm sm:text-base hidden md:table-cell">{product.stock}</td>
                    <td className="p-2 xs:p-2 sm:p-3 md:p-4 flex space-x-1 xs:space-x-2">
                      <button
                        onClick={() => handleEdit(product)}
                        className="flex items-center px-1 xs:px-2 sm:px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-xs sm:text-sm"
                      >
                        <FaEdit className="mr-0 xs:mr-1" />
                        <span className="hidden xs:inline">Edit</span>
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="flex items-center px-1 xs:px-2 sm:px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors text-xs sm:text-sm"
                      >
                        <FaTrash className="mr-0 xs:mr-1" />
                        <span className="hidden xs:inline">Delete</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </SideBarHeader>
  );
};

export default EditDeleteProductsPage;