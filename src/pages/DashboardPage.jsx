import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchProducts } from '../redux/slices/productSlice';
import SideBarHeader from '../components/SideBarHeader';
import { Pie, Scatter, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, ScatterController, PointElement, LinearScale, BarElement, CategoryScale, Title } from 'chart.js';
import { FaPlus, FaEdit } from 'react-icons/fa';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, ScatterController, PointElement, LinearScale, BarElement, CategoryScale, Title);

const DashboardPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { products, loading, error } = useSelector((state) => state.product);

  // Fetch all products for analysis
  useEffect(() => {
    if (products.length === 0) {
      dispatch(fetchProducts({ limit: 100, skip: 0 })); // Fetch all products
    }
  }, [dispatch, products.length]);

  // Process data for graphs
  const categoryData = () => {
    const categories = {};
    products.forEach((product) => {
      categories[product.category] = (categories[product.category] || 0) + 1;
    });
    return {
      labels: Object.keys(categories),
      datasets: [
        {
          data: Object.values(categories),
          backgroundColor: [
            '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD',
            '#D4A5A5', '#9B59B6', '#3498DB', '#E74C3C', '#2ECC71',
          ],
          borderColor: '#1F2937',
          borderWidth: 1,
        },
      ],
    };
  };

  const priceVsRatingData = () => {
    return {
      datasets: [
        {
          label: 'Price vs Rating',
          data: products.map((product) => ({
            x: product.price,
            y: product.rating,
          })),
          backgroundColor: '#F97316',
          pointRadius: 5,
        },
      ],
    };
  };

  const stockByCategoryData = () => {
    const stockByCategory = {};
    products.forEach((product) => {
      stockByCategory[product.category] = (stockByCategory[product.category] || 0) + product.stock;
    });
    return {
      labels: Object.keys(stockByCategory),
      datasets: [
        {
          label: 'Total Stock',
          data: Object.values(stockByCategory),
          backgroundColor: '#F97316',
          borderColor: '#1F2937',
          borderWidth: 1,
        },
      ],
    };
  };

  const discountData = () => {
    const bins = [0, 5, 10, 15, 20, 25, 30];
    const discountCounts = bins.map(() => 0);

    products.forEach((product) => {
      const discount = product.discountPercentage;
      for (let i = 0; i < bins.length - 1; i++) {
        if (discount >= bins[i] && discount < bins[i + 1]) {
          discountCounts[i]++;
          break;
        }
      }
      if (discount >= bins[bins.length - 1]) {
        discountCounts[bins.length - 1]++;
      }
    });

    return {
      labels: bins.map((bin, index) => (index === bins.length - 1 ? `${bin}+` : `${bin}-${bins[index + 1]}`)),
      datasets: [
        {
          label: 'Number of Products',
          data: discountCounts,
          backgroundColor: '#F97316',
          borderColor: '#1F2937',
          borderWidth: 1,
        },
      ],
    };
  };

  // Graph options
  const pieOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top', labels: { color: '#D1D5DB' } },
      title: { display: true, text: 'Product Category Distribution', color: '#F97316', font: { size: 16 } },
    },
  };

  const scatterOptions = {
    responsive: true,
    scales: {
      x: { title: { display: true, text: 'Price ($)', color: '#D1D5DB' }, ticks: { color: '#D1D5DB' } },
      y: { title: { display: true, text: 'Rating', color: '#D1D5DB' }, ticks: { color: '#D1D5DB' }, max: 5, min: 0 },
    },
    plugins: {
      legend: { labels: { color: '#D1D5DB' } },
      title: { display: true, text: 'Price vs Rating', color: '#F97316', font: { size: 16 } },
    },
  };

  const barOptions = {
    responsive: true,
    scales: {
      x: { title: { display: true, text: 'Category', color: '#D1D5DB' }, ticks: { color: '#D1D5DB' } },
      y: { title: { display: true, text: 'Total Stock', color: '#D1D5DB' }, ticks: { color: '#D1D5DB' } },
    },
    plugins: {
      legend: { labels: { color: '#D1D5DB' } },
      title: { display: true, text: 'Stock Levels by Category', color: '#F97316', font: { size: 16 } },
    },
  };

  const histogramOptions = {
    responsive: true,
    scales: {
      x: { title: { display: true, text: 'Discount Percentage (%)', color: '#D1D5DB' }, ticks: { color: '#D1D5DB' } },
      y: { title: { display: true, text: 'Number of Products', color: '#D1D5DB' }, ticks: { color: '#D1D5DB' } },
    },
    plugins: {
      legend: { labels: { color: '#D1D5DB' } },
      title: { display: true, text: 'Discount Percentage Distribution', color: '#F97316', font: { size: 16 } },
    },
  };

  if (loading) {
    return (
      <SideBarHeader>
        <div className="w-full max-w-7xl mx-auto px-2 xs:px-3 sm:px-4 md:px-6 lg:px-8 py-6">
          <p className="text-gray-300 text-center">Loading dashboard...</p>
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
      <div className="w-full max-w-7xl mx-auto px-2 xs:px-3 sm:px-4 md:px-6 lg:px-8 py-6 bg-gray-900 min-h-screen">
        {/* Header Section */}
        <section className="mb-6 flex justify-between items-center">
          <h1 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold text-orange-500">
            Analytics Dashboard
          </h1>
          <div className="flex space-x-2 xs:space-x-3">
            <button
              onClick={() => navigate('/edit-delete-products')}
              className="flex items-center cursor-pointer px-3 xs:px-4 sm:px-5 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm xs:text-base sm:text-lg"
            >
              <FaEdit className="mr-2" />
              Edit/Delete Products
            </button>
            <button
              onClick={() => navigate('/add-product')}
              className="flex items-center cursor-pointer px-3 xs:px-4 sm:px-5 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors text-sm xs:text-base sm:text-lg"
            >
              <FaPlus className="mr-2" />
              Add New Product
            </button>
          </div>
        </section>

        {/* Graphs Section */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 xs:gap-6 sm:gap-8">
          {/* Pie Chart: Category Distribution */}
          <div className="bg-gray-800 rounded-lg shadow-lg p-4 xs:p-5 sm:p-6">
            <Pie data={categoryData()} options={pieOptions} />
          </div>

          {/* Scatter Plot: Price vs Rating */}
          <div className="bg-gray-800 rounded-lg shadow-lg p-4 xs:p-5 sm:p-6">
            <Scatter data={priceVsRatingData()} options={scatterOptions} />
          </div>

          {/* Bar Chart: Stock Levels by Category */}
          <div className="bg-gray-800 rounded-lg shadow-lg p-4 xs:p-5 sm:p-6">
            <Bar data={stockByCategoryData()} options={barOptions} />
          </div>

          {/* Histogram: Discount Percentage Distribution (using Bar chart) */}
          <div className="bg-gray-800 rounded-lg shadow-lg p-4 xs:p-5 sm:p-6">
            <Bar data={discountData()} options={histogramOptions} />
          </div>
        </section>
      </div>
    </SideBarHeader>
  );
};

export default DashboardPage;