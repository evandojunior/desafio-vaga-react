import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import LoginScreen from '../app/(auth)/login';
import { useAuthStore } from '../src/store/useAuthStore';
import { AuthRepository } from '../src/repositories/AuthRepository';
import { useRouter } from 'expo-router';

// Mock Router
jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
}));

// Mock the AuthRepository
jest.mock('../src/repositories/AuthRepository');

describe('LoginScreen', () => {
  let mockPush: jest.Mock;
  let mockReplace: jest.Mock;
  const mockedLogin = jest.fn();

  beforeEach(() => {
    mockPush = jest.fn();
    mockReplace = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
      replace: mockReplace,
    });

    (AuthRepository as jest.Mock).mockImplementation(() => ({
      login: mockedLogin,
    }));

    useAuthStore.setState({ isLoading: false, isAuthenticated: false, user: null, token: null });
    jest.clearAllMocks();
  });

  it('renders login components correctly', () => {
    const { getByText, getByPlaceholderText } = render(<LoginScreen />);

    expect(getByText('Bem-vindo(a)')).toBeTruthy();
    expect(getByPlaceholderText('Digite seu e-mail')).toBeTruthy();
    expect(getByPlaceholderText('Digite sua senha')).toBeTruthy();
  });

  it('calls login on the repository and navigates on success', async () => {
    mockedLogin.mockResolvedValue({
      user: { id: 'u1', name: 'Dev', email: 'Digite seu e-mail' },
      token: 'fake-jwt',
    });

    const { getByText, getByPlaceholderText } = render(<LoginScreen />);

    const emailInput = getByPlaceholderText('Digite seu e-mail');
    const passwordInput = getByPlaceholderText('Digite sua senha');
    const loginBtn = getByText('Entrar');

    fireEvent.changeText(emailInput, 'Digite seu e-mail');
    fireEvent.changeText(passwordInput, 'admin123');
    fireEvent.press(loginBtn);

    await waitFor(() => {
      expect(mockedLogin).toHaveBeenCalledWith('Digite seu e-mail', 'admin123');
      expect(useAuthStore.getState().isAuthenticated).toBe(true);
      expect(mockReplace).toHaveBeenCalledWith('/(tabs)');
    });
  });

  it('navigates to register screen', () => {
    const { getByText } = render(<LoginScreen />);
    const registerLink = getByText('Cadastre-se');

    fireEvent.press(registerLink);
    expect(mockPush).toHaveBeenCalledWith('/(auth)/register');
  });
});
