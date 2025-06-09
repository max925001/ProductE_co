import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Hard-coded admin usernames for testing with DummyJSON API
const ADMIN_USERNAMES = ['emilys', 'michaelw'];

export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await fetch('https://dummyjson.com/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      if (!response.ok) {
        throw new Error('Invalid credentials');
      }
      const data = await response.json();
      console.log(data)
      // Assign role based on username for testing
      const role = ADMIN_USERNAMES.includes(credentials.username) ? 'admin' : 'user';
      localStorage.setItem('data', JSON.stringify(data));
      localStorage.setItem('role', role);
      return { ...data, role }; // Add role to the response data
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    data: JSON.parse(localStorage.getItem('data')) || null,
    role: localStorage.getItem('role') || null,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.role = null;
      localStorage.removeItem('data');
      localStorage.removeItem('role');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        
        state.loading = false;
        state.data = action.payload;
        state.role = action.payload.role;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;