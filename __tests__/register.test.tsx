import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import RegisterScreen from '../src/app/(auth)/register';
import { useAuthStore } from '../src/store/useAuthStore';
import { AuthRepository } from '../src/repositories/AuthRepository';
import { useRouter } from 'expo-router';

jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
}));

jest.mock('../src/repositories/AuthRepository');

describe('RegisterScreen', () => {
  let mockReplace: jest.Mock;
  const mockedRegister = jest.fn();

  beforeEach(() => {
    mockReplace = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({
      replace: mockReplace,
    });

    (AuthRepository as jest.Mock).mockImplementation(() => ({
      register: mockedRegister,
    }));

    useAuthStore.setState({ isLoading: false, isAuthenticated: false, user: null, token: null });
    jest.clearAllMocks();
  });

  it('renders register components correctly', () => {
    const { getByText, getByPlaceholderText } = render(<RegisterScreen />);

    expect(getByText('Criar Conta')).toBeTruthy();
    expect(getByPlaceholderText('Digite seu nome')).toBeTruthy();
    expect(getByPlaceholderText('Digite seu e-mail')).toBeTruthy();
    expect(getByPlaceholderText('******')).toBeTruthy();
  });

  it('calls register on the repository and navigates on success', async () => {
    mockedRegister.mockResolvedValue({
      user: { id: 'u2', name: 'Tester', email: 'test@test.com' },
      token: 'fake-jwt-2',
    });

    const { getByText, getByPlaceholderText } = render(<RegisterScreen />);

    fireEvent.changeText(getByPlaceholderText('Digite seu nome'), 'Tester');
    fireEvent.changeText(getByPlaceholderText('Digite seu e-mail'), 'test@test.com');
    fireEvent.changeText(getByPlaceholderText('******'), 'pass123');
    fireEvent.press(getByText('Cadastrar'));

    await waitFor(() => {
      expect(mockedRegister).toHaveBeenCalledWith('Tester', 'test@test.com', 'pass123');
      expect(useAuthStore.getState().isAuthenticated).toBe(true);
      expect(mockReplace).toHaveBeenCalledWith('/(tabs)');
    });
  });

  it('navigates back to login screen', () => {
    const { getByText } = render(<RegisterScreen />);
    const loginLink = getByText('Faça Login');

    fireEvent.press(loginLink);
    expect(mockReplace).toHaveBeenCalledWith('/(auth)/login');
  });
});
