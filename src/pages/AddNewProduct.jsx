import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addProduct } from '../redux/slices/productSlice';
import SideBarHeader from '../components/SideBarHeader';

const AddNewProduct = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.product);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    category: '',
    stock: '',
    discountPercentage: '',
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Convert string inputs to appropriate types
    const productData = {
      title: formData.title,
      price: parseFloat(formData.price),
      category: formData.category,
      stock: parseInt(formData.stock, 10),
      discountPercentage: parseFloat(formData.discountPercentage),
    };
    dispatch(addProduct(productData)).then((result) => {
      if (result.meta.requestStatus === 'fulfilled') {
        navigate('/edit-delete-products'); // Redirect on success
      }
    });
  };

  return (
    <SideBarHeader>
      <div className="w-full max-w-7xl mx-auto px-2 xs:px-3 sm:px-4 md:px-6 lg:px-8 py-6 bg-gray-900 min-h-screen">
        {/* Header Section */}
        <section className="mb-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-orange-500 hover:underline text-sm xs:text-base mb-4 inline-block cursor-pointer"
          >
            ← Back to Dashboard
          </button>
          <h1 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold text-orange-500">
            Add New Product
          </h1>
        </section>

        {/* Form Section */}
        <section className="bg-gray-800 rounded-lg shadow-lg p-4 xs:p-5 sm:p-6">
          {error && (
            <p className="text-red-500 text-center mb-4 text-sm xs:text-base sm:text-lg">
              Error: {error}
            </p>
          )}
          <div className="w-full max-w-lg mx-auto">
            <div className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-gray-300 text-sm xs:text-base sm:text-lg mb-1">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-3 xs:px-4 py-2 bg-gray-700 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm xs:text-base"
                  placeholder="Enter product title"
                  required
                />
              </div>
              <div>
                <label htmlFor="price" className="block text-gray-300 text-sm xs:text-base sm:text-lg mb-1">
                  Price ($)
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full px-3 xs:px-4 py-2 bg-gray-700 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm xs:text-base"
                  placeholder="Enter price"
                  required
                  min="0"
                  step="0.01"
                />
              </div>
              <div>
                <label htmlFor="category" className="block text-gray-300 text-sm xs:text-base sm:text-lg mb-1">
                  Category
                </label>
                <input
                  type="text"
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-3 xs:px-4 py-2 bg-gray-700 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm xs:text-base"
                  placeholder="Enter category"
                  required
                />
              </div>
              <div>
                <label htmlFor="stock" className="block text-gray-300 text-sm xs:text-base sm:text-lg mb-1">
                  Stock
                </label>
                <input
                  type="number"
                  id="stock"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  className="w-full px-3 xs:px-4 py-2 bg-gray-700 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm xs:text-base"
                  placeholder="Enter stock quantity"
                  required
                  min="0"
                />
              </div>
              <div>
                <label htmlFor="discountPercentage" className="block text-gray-300 text-sm xs:text-base sm:text-lg mb-1">
                  Discount Percentage (%)
                </label>
                <input
                  type="number"
                  id="discountPercentage"
                  name="discountPercentage"
                  value={formData.discountPercentage}
                  onChange={handleChange}
                  className="w-full px-3 xs:px-4 py-2 bg-gray-700 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm xs:text-base"
                  placeholder="Enter discount percentage"
                  required
                  min="0"
                  max="100"
                  step="0.01"
                />
              </div>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className={`w-full px-3 xs:px-4 cursor-pointer sm:px-5 py-2 rounded-md text-white text-sm xs:text-base sm:text-lg transition-colors ${
                  loading ? 'bg-orange-600 cursor-not-allowed' : 'bg-orange-500 hover:bg-orange-600'
                }`}
              >
                {loading ? 'Adding Product...' : 'Add Product'}
              </button>
            </div>
          </div>
        </section>
      </div>
    </SideBarHeader>
  );
};

export default AddNewProduct;