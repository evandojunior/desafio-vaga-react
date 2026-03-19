import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { StoreCard } from '../components/StoreCard';
import { Store } from '../src/types';

// Mock expo-router
jest.mock('expo-router', () => ({
  router: { push: jest.fn() },
}));

// Mock @expo/vector-icons
jest.mock('@expo/vector-icons', () => ({
  Ionicons: 'Ionicons',
}));

const mockStore: Store = {
  id: '1',
  name: 'Loja Teste',
  address: 'Rua Teste, 123',
  productsCount: 5,
  createdAt: new Date().toISOString(),
};

describe('StoreCard', () => {
  it('renders store name and address', () => {
    const onDelete = jest.fn();
    const { getByText } = render(
      <StoreCard store={mockStore} onDelete={onDelete} />
    );
    expect(getByText('Loja Teste')).toBeTruthy();
    expect(getByText('Rua Teste, 123')).toBeTruthy();
  });

  it('renders product count badge', () => {
    const onDelete = jest.fn();
    const { getByText } = render(
      <StoreCard store={mockStore} onDelete={onDelete} />
    );
    expect(getByText('5 produtos')).toBeTruthy();
  });

  it('shows delete dialog when Excluir is pressed', () => {
    const onDelete = jest.fn();
    const { getByText, queryByText } = render(
      <StoreCard store={mockStore} onDelete={onDelete} />
    );

    expect(queryByText('Excluir Loja')).toBeNull();
    fireEvent.press(getByText('Excluir'));
    expect(getByText('Excluir Loja')).toBeTruthy();
  });

  it('calls onDelete when confirming deletion', async () => {
    const onDelete = jest.fn().mockResolvedValue(undefined);
    const { getByText, getAllByText } = render(
      <StoreCard store={mockStore} onDelete={onDelete} />
    );

    fireEvent.press(getByText('Excluir'));
    // There will be two "Excluir" buttons — the card one and the dialog confirm
    const excluirButtons = getAllByText('Excluir');
    fireEvent.press(excluirButtons[excluirButtons.length - 1]);

    await waitFor(() => {
      expect(onDelete).toHaveBeenCalledWith('1');
    });
  });

  it('renders "produto" singular when count is 1', () => {
    const onDelete = jest.fn();
    const singleProductStore = { ...mockStore, productsCount: 1 };
    const { getByText } = render(
      <StoreCard store={singleProductStore} onDelete={onDelete} />
    );
    expect(getByText('1 produto')).toBeTruthy();
  });
});
