import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Fetch all products
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async ({ limit = 100, skip = 0 }, { rejectWithValue }) => {
    try {
      const response = await fetch(`https://dummyjson.com/products?limit=${limit}&skip=${skip}`);
      if (!response.ok) {
        throw new Error('Server error fetching products');
      }
      const data = await response.json();
      return { products: data.products, total: data.total };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Fetch recommended products
export const fetchRecommendedProducts = createAsyncThunk(
  'products/fetchRecommendedProducts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('https://dummyjson.com/products?limit=5&skip=0');
      if (!response.ok) {
        throw new Error('Server error fetching recommended products');
      }
      const data = await response.json();
      return data.products;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Fetch a single product by ID
export const fetchProductById = createAsyncThunk(
  'products/fetchProductById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`https://dummyjson.com/products/${id}`);
      if (!response.ok) throw new Error('Failed to fetch product');
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Fetch products by search query
export const fetchProductsBySearch = createAsyncThunk(
  'products/fetchProductsBySearch',
  async (query, { rejectWithValue }) => {
    try {
      const response = await fetch(`https://dummyjson.com/products/search?q=${encodeURIComponent(query)}`);
      if (!response.ok) {
        throw new Error('Server error fetching search results');
      }
      const data = await response.json();
      return data.products;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Add a new product
export const addProduct = createAsyncThunk(
  'products/addProduct',
  async (productData, { rejectWithValue }) => {
    try {
      const response = await fetch('https://dummyjson.com/products/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });
      if (!response.ok) {
        throw new Error('Failed to add product');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Update a product
export const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async ({ id, updatedData }, { rejectWithValue }) => {
    try {
      const response = await fetch(`https://dummyjson.com/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });
      if (!response.ok) {
        throw new Error('Failed to update product');
      }
      const data = await response.json();
      return { id, updatedProduct: data };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Delete a product
export const deleteProduct = createAsyncThunk(
  'products/deleteProduct',
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`https://dummyjson.com/products/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete product');
      }
      const data = await response.json();
      return { id, deletedProduct: data };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const productSlice = createSlice({
  name: 'product',
  initialState: {
    products: [], // All products (cached)
    recommendedProducts: [],
    currentProduct: null,
    searchResults: [], // New field for search results
    searchQuery: '', // New field to track the current search query
    total: 0,
    currentPage: 1,
    productsPerPage: 20,
    loading: false,
    error: null,
  },
  reducers: {
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
      if (!action.payload) {
        state.searchResults = []; // Clear search results when query is empty
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all products
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = [...state.products, ...action.payload.products];
        state.total = action.payload.total;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch recommended products
      .addCase(fetchRecommendedProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecommendedProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.recommendedProducts = action.payload;
      })
      .addCase(fetchRecommendedProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch product by ID
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.currentProduct = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.currentProduct = null;
      })
      // Fetch products by search query
      .addCase(fetchProductsBySearch.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductsBySearch.fulfilled, (state, action) => {
        state.loading = false;
        state.searchResults = action.payload;
      })
      .addCase(fetchProductsBySearch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.searchResults = [];
      })
      // Add product
      .addCase(addProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products.push(action.payload); // Add the new product to the list
      })
      .addCase(addProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update product
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        const { id, updatedProduct } = action.payload;
        const index = state.products.findIndex((product) => product.id === id);
        if (index !== -1) {
          state.products[index] = { ...state.products[index], ...updatedProduct };
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete product
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        const { id } = action.payload;
        state.products = state.products.filter((product) => product.id !== id);
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setCurrentPage, setSearchQuery } = productSlice.actions;
export default productSlice.reducer;