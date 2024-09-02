import { render, screen } from '@testing-library/react';
import UserList from './components/UserList';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import usersReducer from './redux/usersSlice';
import { RootState } from './redux/store';
import { BrowserRouter } from 'react-router-dom';

const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}));

const renderWithProviders = (
  ui: React.ReactElement,
  { reduxState }: { reduxState?: Partial<RootState> } = {}
) => {
  const store = configureStore({
    reducer: {
      users: usersReducer,
    },
    preloadedState: reduxState as RootState,
  });
  return {
    ...render(
      <Provider store={store}>
        <BrowserRouter>
          {ui}
        </BrowserRouter>
      </Provider>
    ),
    store,
  };
};

describe('UserList', () => {
  beforeEach(() => {
    mockDispatch.mockClear();
  });

  test('displays loading message when loading', () => {
    renderWithProviders(<UserList />, {
      reduxState: { users: { users: [], loading: true, error: null } },
    });

    expect(screen.getByText(/loading.../i)).toBeInTheDocument();
  });

  test('displays list of users', async () => {
    const users = [
      { id: 4, name: 'shim', email: 'shim@gmail.com', password: 'shim' },
    ];

    renderWithProviders(<UserList />, {
      reduxState: { users: { users, loading: false, error: null } },
    });

    expect(await screen.findByText('shim')).toBeInTheDocument();
    expect(await screen.findByText('shim@gmail.com')).toBeInTheDocument();
  });
});
