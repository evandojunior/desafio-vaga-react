import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import { ProductCard } from './index';

// Mock expo-router
jest.mock('expo-router', () => ({
  router: {
    push: jest.fn(),
  },
}));

// Mock Ionicons
jest.mock('@expo/vector-icons', () => {
  const { Text } = require('react-native');
  return {
    Ionicons: (props: any) => <Text>{props.name}</Text>,
  };
});

// Mock the UI components used to simplify test
jest.mock('../ui/alert-dialog', () => ({
  AlertDialog: ({ isOpen, children }: any) => (isOpen ? <>{children}</> : null),
  AlertDialogContent: ({ children }: any) => <>{children}</>,
  AlertDialogHeader: ({ children }: any) => <>{children}</>,
  AlertDialogBody: ({ children }: any) => <>{children}</>,
  AlertDialogFooter: ({ children }: any) => <>{children}</>,
}));

jest.mock('../ui/heading', () => {
  const { Text } = require('react-native');
  return {
    Heading: ({ children }: any) => <Text>{children}</Text>,
  };
});

jest.mock('../ui/text', () => {
  const { Text } = require('react-native');
  return {
    Text: ({ children }: any) => <Text>{children}</Text>,
  };
});

import { Product, ProductCategory } from '@/src/types';

const mockProduct: Product = {
  id: 'prod-1',
  name: 'Super Product',
  price: 99.9,
  category: 'Eletrônicos' as ProductCategory,
  storeId: 'store-1',
  createdAt: new Date().toISOString(),
};

describe('ProductCard component', () => {
  it('renders product details correctly', () => {
    const onDeleteMock = jest.fn();
    render(<ProductCard product={mockProduct} storeId="store-1" storeName="My Store" onDelete={onDeleteMock} />);

    expect(screen.getByText('Super Product')).toBeTruthy();
    expect(screen.getByText('Eletrônicos')).toBeTruthy();
    expect(screen.getByText('My Store')).toBeTruthy();
    
    // Check price format depending on locale. It might be R$ 99,90
    // But testing exact string might fail depending on node version, let's test if the text contains 99
    expect(screen.getByText(/99/)).toBeTruthy();
  });

  it('navigates to edit screen when edit button is pressed', () => {
    const { router } = require('expo-router');
    const onDeleteMock = jest.fn();
    
    render(<ProductCard product={mockProduct} storeId="store-1" onDelete={onDeleteMock} />);
    
    const pencilIcon = screen.getByText('pencil');
    expect(pencilIcon).toBeTruthy();
    fireEvent.press(pencilIcon);

    expect(router.push).toHaveBeenCalledWith('/stores/store-1/products/prod-1/edit');
  });

  it('shows delete dialog and calls onDelete when confirmed', async () => {
    const onDeleteMock = jest.fn().mockResolvedValue(undefined);
    
    render(<ProductCard product={mockProduct} storeId="store-1" onDelete={onDeleteMock} />);
    
    const trashIcon = screen.getByText('trash-outline');
    expect(trashIcon).toBeTruthy();
    
    // Open dialog
    fireEvent.press(trashIcon);
    
    // Dialog should be open. Check title
    expect(await screen.findByText('Excluir Produto')).toBeTruthy();
    
    // Press the delete button in footer
    const confirmButtonTexts = await screen.findAllByText('Excluir');
    const confirmButton = confirmButtonTexts[confirmButtonTexts.length - 1];
    
    fireEvent.press(confirmButton);
    
    await waitFor(() => {
      expect(onDeleteMock).toHaveBeenCalledWith('prod-1');
    });
  });
});

