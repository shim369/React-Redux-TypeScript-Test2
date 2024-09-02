import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { User } from '../types/user';

const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

if (!apiBaseUrl) {
  throw new Error("API base URL is not defined in environment variables.");
}

interface UsersState {
  users: User[];
  loading: boolean;
  error: string | null;
}

const initialState: UsersState = {
  users: [],
  loading: false,
  error: null,
};

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  return response.json();
};

export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
  const response = await fetch(apiBaseUrl);
  return handleResponse(response);
});


export const createUser = createAsyncThunk(
  'users/createUser',
  async ({ name, email, password }: { name: string; email: string; password: string }) => {
    const response = await fetch(apiBaseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    });
    return handleResponse(response);
  }
);

export const fetchUserById = createAsyncThunk<User, number>(
  'users/fetchUserById',
  async (id) => {
    const response = await fetch(`${apiBaseUrl}/${id}`);
    return handleResponse(response);
  }
);

export const updateUserById = createAsyncThunk<void, { id: number; name: string; email: string; password?: string }>(
  'users/updateUserById',
  async ({ id, ...updateData }) => {
    const response = await fetch(`${apiBaseUrl}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    });
    return handleResponse(response);
  }
);

export const deleteUser = createAsyncThunk(
  'users/deleteUser',
  async (id: number) => {
    const response = await fetch(`${apiBaseUrl}/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to delete user. Status: ${response.status}. ${errorText}`);
    }
    return id;
  }
);

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
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
        state.error = action.error.message || 'Failed to fetch users';
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        const existingUserIndex = state.users.findIndex(user => user.id === action.payload.id);
        if (existingUserIndex !== -1) {
          state.users[existingUserIndex] = action.payload;
        } else {
          state.users.push(action.payload);
        }
        state.loading = false;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch user';
      })
      .addCase(updateUserById.fulfilled, (state, action) => {
        const { id, name, email, password } = action.meta.arg;
        const existingUserIndex = state.users.findIndex(user => user.id === id);
        if (existingUserIndex !== -1) {
          state.users[existingUserIndex] = { id, name, email, password: password ?? state.users[existingUserIndex].password };
        }
        state.loading = false;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter(user => user.id !== action.payload);
      });
  },
});

export default usersSlice.reducer;
