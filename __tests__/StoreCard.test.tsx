import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { StoreCard } from '../src/components/StoreCard';
import { Store } from '../src/types';

// Mock expo-router
jest.mock('expo-router', () => ({
  router: { push: jest.fn() },
}));

// Mock @expo/vector-icons
jest.mock('@expo/vector-icons', () => {
  const { Text } = require('react-native');
  return {
    Ionicons: (props: any) => <Text>{props.name}</Text>,
  };
});

// Mock the UI components used to simplify test
jest.mock('../src/components/ui/alert-dialog', () => ({
  AlertDialog: ({ isOpen, children }: any) => (isOpen ? <>{children}</> : null),
  AlertDialogContent: ({ children }: any) => <>{children}</>,
  AlertDialogHeader: ({ children }: any) => <>{children}</>,
  AlertDialogBody: ({ children }: any) => <>{children}</>,
  AlertDialogFooter: ({ children }: any) => <>{children}</>,
}));

jest.mock('../src/components/ui/heading', () => {
  const { Text } = require('react-native');
  return {
    Heading: ({ children }: any) => <Text>{children}</Text>,
  };
});

jest.mock('../src/components/ui/text', () => {
  const { Text } = require('react-native');
  return {
    Text: ({ children }: any) => <Text>{children}</Text>,
  };
});

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
    expect(getByText('5 prods.')).toBeTruthy();
  });

  it('shows delete dialog when trash icon is pressed', async () => {
    const onDelete = jest.fn();
    const { getByText, queryByText } = render(
      <StoreCard store={mockStore} onDelete={onDelete} />
    );

    expect(queryByText('Excluir Loja')).toBeNull();
    fireEvent.press(getByText('trash-outline'));
    expect(await waitFor(() => getByText('Excluir Loja'))).toBeTruthy();
  });

  it('calls onDelete when confirming deletion', async () => {
    const onDelete = jest.fn().mockResolvedValue(undefined);
    const { getByText } = render(
      <StoreCard store={mockStore} onDelete={onDelete} />
    );

    fireEvent.press(getByText('trash-outline'));

    // The dialog opens, wait for Excluir (confirm) button
    await waitFor(() => {
      expect(getByText('Excluir')).toBeTruthy();
    });
    fireEvent.press(getByText('Excluir'));

    await waitFor(() => {
      expect(onDelete).toHaveBeenCalledWith('1');
    });
  });

  it('renders "prod." singular when count is 1', () => {
    const onDelete = jest.fn();
    const singleProductStore = { ...mockStore, productsCount: 1 };
    const { getByText } = render(
      <StoreCard store={singleProductStore} onDelete={onDelete} />
    );
    expect(getByText('1 prod.')).toBeTruthy();
  });
});
