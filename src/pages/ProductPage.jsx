import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaStar } from 'react-icons/fa';
import SideBarHeader from '../components/SideBarHeader';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { fetchProductById } from '../redux/slices/productSlice';

// Custom arrow components for react-slick
const PrevArrow = (props) => {
  const { onClick } = props;
  return (
    <button
      onClick={onClick}
      className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 bg-orange-500 text-white p-2 rounded-full hover:bg-orange-600 focus:outline-none"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        className="w-6 h-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 19l-7-7 7-7"
        />
      </svg>
    </button>
  );
};

const NextArrow = (props) => {
  const { onClick } = props;
  return (
    <button
      onClick={onClick}
      className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 bg-orange-500 text-white p-2 rounded-full hover:bg-orange-600 focus:outline-none"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        className="w-6 h-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 5l7 7-7 7"
        />
      </svg>
    </button>
  );
};

function ProductPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const { currentProduct, loading, error } = useSelector((state) => state.product);

  // Fetch the product by ID when the page loads or ID changes
  useEffect(() => {
    dispatch(fetchProductById(id));
  }, [dispatch, id]);

  // Display loading state
  if (loading) {
    return (
      <SideBarHeader>
        <div className="w-full max-w-7xl mx-auto px-2 xs:px-3 sm:px-4 md:px-6 lg:px-8 py-6">
          <button
            onClick={() => navigate('/')}
            className="text-orange-500 hover:underline text-sm xs:text-base mb-4 inline-block"
          >
            ← Back to Home
          </button>
          <p className="text-gray-300 text-center">Loading...</p>
        </div>
      </SideBarHeader>
    );
  }

  // Display error state
  if (error) {
    return (
      <SideBarHeader>
        <div className="w-full max-w-7xl mx-auto px-2 xs:px-3 sm:px-4 md:px-6 lg:px-8 py-6">
          <button
            onClick={() => navigate('/')}
            className="text-orange-500 hover:underline text-sm xs:text-base mb-4 inline-block"
          >
            ← Back to Home
          </button>
          <p className="text-red-500 text-center">Error: {error}</p>
        </div>
      </SideBarHeader>
    );
  }

  // If product is not found, display a message
  if (!currentProduct || currentProduct.id !== parseInt(id)) {
    return (
      <SideBarHeader>
        <div className="w-full max-w-7xl mx-auto px-2 xs:px-3 sm:px-4 md:px-6 lg:px-8 py-6">
          <button
            onClick={() => navigate('/')}
            className="text-orange-500 hover:underline text-sm xs:text-base mb-4 inline-block"
          >
            ← Back to Home
          </button>
          <p className="text-gray-300 text-center">Product not found.</p>
        </div>
      </SideBarHeader>
    );
  }

  const allImages = [...currentProduct.images, currentProduct.thumbnail];
  const averageRating = currentProduct.rating;

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    dotsClass: "slick-dots custom-dots",
    customPaging: () => (
      <button className="w-3 h-3 bg-gray-400 rounded-full hover:bg-orange-500 transition-colors"></button>
    ),
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          arrows: true,
        },
      },
      {
        breakpoint: 768,
        settings: {
          arrows: true,
        },
      },
      {
        breakpoint: 480,
        settings: {
          arrows: true,
        },
      },
    ],
  };

  return (
    <SideBarHeader>
      <div className="w-full max-w-7xl mx-auto px-2 xs:px-3 sm:px-4 md:px-6 lg:px-8 py-6">
        <section className="mb-6">
          <button
            onClick={() => navigate('/')}
            className="text-orange-500 hover:underline text-sm xs:text-base mb-4 inline-block"
          >
            ← Back to Home
          </button>
          <h1 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold text-orange-500">
            {currentProduct.title}
          </h1>
          <p className="text-sm xs:text-base sm:text-lg text-gray-400 capitalize mt-1">
            Category: {currentProduct.category}
          </p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-4 xs:gap-6 sm:gap-8 mb-8">
          <div className="relative bg-gray-800 rounded-lg shadow-lg p-2 xs:p-3 sm:p-4">
            <Slider {...sliderSettings}>
              {allImages.map((image, index) => (
                <div key={index}>
                  <img
                    src={image}
                    alt={`${currentProduct.title} - Image ${index + 1}`}
                    className="w-full h-48 xs:h-56 sm:h-64 md:h-72 lg:h-80 object-contain rounded-md"
                  />
                </div>
              ))}
            </Slider>
            <style jsx>{`
              .custom-dots {
                display: flex !important;
                justify-content: center;
                margin-top: 1rem;
              }
              .custom-dots li {
                margin: 0 4px;
              }
              .custom-dots li.slick-active button {
                background-color: #f97316;
              }
            `}</style>
          </div>

          <div className="bg-gray-900 rounded-lg shadow-lg p-4 xs:p-5 sm:p-6">
            <div className="space-y-3 xs:space-y-4">
              <div>
                <h2 className="text-base xs:text-lg sm:text-xl font-semibold text-orange-500">
                  Price: ${currentProduct.price.toFixed(2)}
                </h2>
                {currentProduct.discountPercentage > 0 && (
                  <p className="text-xs xs:text-sm text-gray-400">
                    Discount: {currentProduct.discountPercentage}% off
                  </p>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={i < Math.round(averageRating) ? 'text-orange-500' : 'text-gray-400'}
                      size={16}
                    />
                  ))}
                </div>
                <span className="text-sm xs:text-base text-gray-300">
                  {averageRating.toFixed(1)}/5 ({currentProduct.reviews.length} reviews)
                </span>
              </div>
              <div>
                <h3 className="text-sm xs:text-base sm:text-lg font-semibold text-orange-500">
                  Description
                </h3>
                <p className="text-xs xs:text-sm sm:text-base text-gray-300">
                  {currentProduct.description}
                </p>
              </div>
              <div>
                <h3 className="text-sm xs:text-base sm:text-lg font-semibold text-orange-500">
                  Details
                </h3>
                <ul className="text-xs xs:text-sm sm:text-base text-gray-300 space-y-1">
                  <li><strong>Brand:</strong> {currentProduct.brand}</li>
                  <li><strong>Stock:</strong> {currentProduct.stock}</li>
                  <li><strong>Availability:</strong> {currentProduct.availabilityStatus}</li>
                  <li><strong>Warranty:</strong> {currentProduct.warrantyInformation}</li>
                  <li><strong>Shipping:</strong> {currentProduct.shippingInformation}</li>
                  <li><strong>Return Policy:</strong> {currentProduct.returnPolicy}</li>
                  <li><strong>Minimum Order:</strong> {currentProduct.minimumOrderQuantity}</li>
                  <li>
                    <strong>Dimensions:</strong> {currentProduct.dimensions.width}W x {currentProduct.dimensions.height}H x {currentProduct.dimensions.depth}D cm
                  </li>
                  <li><strong>Weight:</strong> {currentProduct.weight} kg</li>
                  <li><strong>SKU:</strong> {currentProduct.sku}</li>
                  <li><strong>Tags:</strong> {currentProduct.tags.join(', ')}</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-4 xs:space-y-5">
          <h2 className="text-base xs:text-lg sm:text-xl md:text-2xl font-semibold text-orange-500 text-center">
            Customer Reviews
          </h2>
          {currentProduct.reviews.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 xs:gap-4 sm:gap-6">
              {currentProduct.reviews.map((review, index) => (
                <div
                  key={index}
                  className="bg-gray-800 rounded-lg shadow-lg p-3 xs:p-4 sm:p-5"
                >
                  <div className="flex items-center space-x-2 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        className={i < review.rating ? 'text-orange-500' : 'text-gray-400'}
                        size={14}
                      />
                    ))}
                    <span className="text-xs xs:text-sm text-gray-300">
                      {review.rating}/5
                    </span>
                  </div>
                  <p className="text-xs xs:text-sm sm:text-base text-gray-300">
                    "{review.comment}"
                  </p>
                  <p className="text-xs xs:text-sm text-orange-400 mt-2">
                    - {review.reviewerName}
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date(review.date).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-center">No reviews yet.</p>
          )}
        </section>
      </div>
    </SideBarHeader>
  );
}

export default ProductPage;