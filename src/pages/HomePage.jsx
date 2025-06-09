import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, fetchRecommendedProducts, fetchProductsBySearch, setCurrentPage, setSearchQuery } from '../redux/slices/productSlice';
import { useNavigate } from 'react-router-dom';
import SideBarHeader from '../components/SideBarHeader';
import { TypeAnimation } from 'react-type-animation';
import { FaSearch, FaTimes } from 'react-icons/fa';

// Custom hook for debouncing
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const HomePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { products, recommendedProducts, searchResults, searchQuery, total, currentPage, productsPerPage, loading, error } = useSelector((state) => state.product);

  // Local state for search input
  const [searchInput, setSearchInput] = useState(searchQuery);

  // Debounce the search input (500ms delay)
  const debouncedSearchInput = useDebounce(searchInput, 500);

  // Fetch products and recommended products on initial load
  useEffect(() => {
    if (recommendedProducts.length === 0) {
      dispatch(fetchRecommendedProducts());
    }
    if (products.length === 0) {
      dispatch(fetchProducts({ limit: productsPerPage, skip: 0 }));
    }
  }, [dispatch, recommendedProducts.length, products.length, productsPerPage]);

  // Trigger search when debounced search input changes
  useEffect(() => {
    if (debouncedSearchInput.trim()) {
      dispatch(setSearchQuery(debouncedSearchInput));
      dispatch(fetchProductsBySearch(debouncedSearchInput));
    } else {
      // Clear search when input is empty
      dispatch(setSearchQuery(''));
    }
  }, [debouncedSearchInput, dispatch]);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
  };

  // Handle search clear
  const handleClearSearch = () => {
    setSearchInput('');
    dispatch(setSearchQuery(''));
  };

  // Pagination handlers
  const handleNextPage = () => {
    const nextPage = currentPage + 1;
    const skip = (nextPage - 1) * productsPerPage;
    if (skip >= products.length) {
      dispatch(fetchProducts({ limit: productsPerPage, skip }));
    }
    dispatch(setCurrentPage(nextPage));
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      dispatch(setCurrentPage(currentPage - 1));
    }
  };

  // Calculate displayed products based on current page
  const startIndex = (currentPage - 1) * productsPerPage;
  const displayedProducts = products.slice(startIndex, startIndex + productsPerPage);
  const totalPages = Math.ceil(total / productsPerPage);

  // Use search results if a search query exists; otherwise, use paginated products
  const productsToDisplay = searchQuery ? searchResults : displayedProducts;

  // Limit recommended products to 4
  const limitedRecommendedProducts = recommendedProducts.slice(0, 4);

  return (
    <SideBarHeader>
      <div className="w-full max-w-7xl mx-auto px-2 xs:px-3 sm:px-4 md:px-6 lg:px-8 py-6 space-y-8">
        {/* Hero Section with Auto-Typing Quote */}
        <section className="text-center py-4 xs:py-5 h-12 xs:h-14 sm:h-16 flex items-center justify-center">
          <TypeAnimation
            sequence={[
              "Discover the best products for you!",
              2000,
              "Quality meets affordability.",
              2000,
              "Shop smarter, live better.",
              2000,
            ]}
            wrapper="h1"
            repeat={Infinity}
            className="text-base xs:text-lg sm:text-xl md:text-2xl font-semibold text-orange-500 leading-tight"
          />
        </section>

        {/* Recommended Products Grid */}
        {limitedRecommendedProducts.length > 0 && (
          <section className="space-y-3 xs:space-y-4">
            <h2 className="text-base xs:text-lg sm:text-xl md:text-2xl font-semibold text-orange-500 text-center">
              Recommended Products
            </h2>
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 xs:gap-4 sm:gap-6">
              {limitedRecommendedProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow cursor-pointer h-full flex flex-col"
                  onClick={() => navigate(`/product/${product.id}`)}
                >
                  <div className="relative w-full h-28 xs:h-32 sm:h-40 md:h-48 lg:h-52">
                    <img
                      src={product.images[0]}
                      alt={product.title}
                      className="w-full h-full object-contain rounded-t-md"
                    />
                  </div>
                  <div className="p-2 xs:p-3 sm:p-4 flex-grow">
                    <h3 className="text-xs xs:text-sm sm:text-base md:text-lg font-semibold text-white line-clamp-2">
                      {product.title}
                    </h3>
                    <p className="text-orange-500 text-xs xs:text-sm sm:text-base mt-1">
                      ${product.price}
                    </p>
                    <p className="text-gray-400 text-xs sm:text-sm mt-1">
                      Rating: {product.rating}/5
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Product Cards with Search */}
        <section className="space-y-3 xs:space-y-4">
          <h2 className="text-base xs:text-lg sm:text-xl md:text-2xl font-semibold text-orange-500 text-center">
            Explore Products
          </h2>

          {/* Search Bar */}
          <div className="flex justify-center mb-4">
            <div className="relative w-full max-w-md">
              <input
                type="text"
                value={searchInput}
                onChange={handleSearchChange}
                placeholder="Search products (e.g., phone)..."
                className="w-full px-4 py-2 text-sm xs:text-base text-gray-300 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 pr-10"
              />
              {searchInput ? (
                <button
                  onClick={handleClearSearch}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-orange-500"
                >
                  <FaTimes size={18} />
                </button>
              ) : (
                <button
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-orange-500"
                >
                  <FaSearch size={18} />
                </button>
              )}
            </div>
          </div>

          {/* Display Search Query */}
          {searchQuery && (
            <div className="text-center">
              <p className="text-gray-300 text-sm xs:text-base">
                Showing results for: <span className="text-orange-500">"{searchQuery}"</span>
              </p>
              {searchResults.length === 0 && !loading && (
                <p className="text-gray-400 text-sm xs:text-base mt-2">No products found.</p>
              )}
            </div>
          )}

          {/* Product Grid */}
          {loading && <p className="text-gray-400 text-center">Loading products...</p>}
          {error && <p className="text-red-500 text-center">Error: {error}</p>}
          {!loading && !error && productsToDisplay.length > 0 ? (
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 xs:gap-4 sm:gap-6">
              {productsToDisplay.map((product) => (
                <div
                  key={product.id}
                  className="bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow cursor-pointer h-full flex flex-col"
                  onClick={() => navigate(`/product/${product.id}`)}
                >
                  <div className="relative w-full h-28 xs:h-32 sm:h-40 md:h-48 lg:h-52">
                    <img
                      src={product.images[0]}
                      alt={product.title}
                      className="w-full h-full object-contain rounded-t-md"
                    />
                  </div>
                  <div className="p-2 xs:p-3 sm:p-4 flex-grow">
                    <h3 className="text-xs xs:text-sm sm:text-base md:text-lg font-semibold text-white line-clamp-2">
                      {product.title}
                    </h3>
                    <p className="text-orange-500 text-xs xs:text-sm sm:text-base mt-1">
                      ${product.price}
                    </p>
                    <p className="text-gray-400 text-xs sm:text-sm mt-1">
                      Rating: {product.rating}/5
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            !loading && !error && searchQuery && <p className="text-gray-400 text-center">No products found.</p>
          )}
        </section>

        {/* Pagination (only shown when not searching) */}
        {!searchQuery && (
          <section className="flex justify-center items-center space-x-2 xs:space-x-3 sm:space-x-4 mt-6 xs:mt-8">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className={`px-2 xs:px-3 sm:px-4 py-1 xs:py-2 rounded-md text-white text-xs xs:text-sm sm:text-base cursor-pointer ${
                currentPage === 1
                  ? 'bg-gray-600 cursor-not-allowed'
                  : 'bg-orange-500 hover:bg-orange-600'
              }`}
            >
              Previous
            </button>
            <span className="text-gray-300 text-xs xs:text-sm sm:text-base">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className={`px-2 xs:px-3 sm:px-4 py-1 xs:py-2 rounded-md text-white cursor-pointer text-xs xs:text-sm sm:text-base ${
                currentPage === totalPages
                  ? 'bg-gray-600 cursor-not-allowed'
                  : 'bg-orange-500 hover:bg-orange-600'
              }`}
            >
              Next
            </button>
          </section>
        )}
      </div>
    </SideBarHeader>
  );
};

export default HomePage;