import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:5097/users";

// Obtener usuarios
export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Obtener usuario por ID
export const fetchUserById = createAsyncThunk(
  "users/fetchUserById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Crear usuario
export const createUser = createAsyncThunk(
  "users/createUser",
  async (user, { rejectWithValue }) => {
    try {
      const response = await axios.post(API_URL, user);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Actualizar usuario
export const updateUser = createAsyncThunk(
  "users/updateUser",
  async ({ id, userData }, { rejectWithValue }) => {
    try {
      await axios.put(`${API_URL}/${id}`, userData);
      return { id, ...userData };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Eliminar usuario
export const deleteUser = createAsyncThunk(
  "users/deleteUser",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const userSlice = createSlice({
  name: "users",
  initialState: { users: [], loading: false, selectedUser: null, error: null },
  reducers: {
    // Reducer para limpiar el error
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.users = action.payload;
        state.loading = false;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.selectedUser = action.payload;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.users.push(action.payload);
        state.error = null;
      })
      .addCase(createUser.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        const index = state.users.findIndex(
          (user) => user.id === action.payload.id
        );
        if (index !== -1) {
          state.users[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter((user) => user.id !== action.payload);
        state.error = null;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

// Exporta la acción clearError
export const { clearError } = userSlice.actions;
export default userSlice.reducer;
